
-- HIS: Explicit course pricing and Paystack transactions.
-- Prices are stored in the currency's smallest unit.
-- Example: NGN 25,000.00 = 2500000 kobo.

CREATE TABLE IF NOT EXISTS public.course_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  course_id uuid NOT NULL
    REFERENCES public.courses(id) ON DELETE CASCADE,

  -- ISO country/market code, e.g. NG, GH, KE, ZA.
  market text NOT NULL
    CHECK (market ~ '^[A-Z]{2}$'),

  -- Explicitly configured currency, e.g. NGN, GHS, KES, ZAR.
  currency text NOT NULL
    CHECK (currency ~ '^[A-Z]{3}$'),

  amount_minor bigint NOT NULL
    CHECK (amount_minor > 0),

  is_active boolean NOT NULL DEFAULT false,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (course_id, market, currency)
);

CREATE INDEX IF NOT EXISTS idx_course_prices_lookup
  ON public.course_prices (course_id, market, currency)
  WHERE is_active = true;


CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  student_id uuid NOT NULL
    REFERENCES public.profiles(id) ON DELETE RESTRICT,

  course_id uuid NOT NULL
    REFERENCES public.courses(id) ON DELETE RESTRICT,

  course_price_id uuid NOT NULL
    REFERENCES public.course_prices(id) ON DELETE RESTRICT,

  provider text NOT NULL DEFAULT 'paystack'
    CHECK (provider IN ('paystack')),

  reference text NOT NULL UNIQUE,

  provider_transaction_id text,

  amount_minor bigint NOT NULL
    CHECK (amount_minor > 0),

  currency text NOT NULL
    CHECK (currency ~ '^[A-Z]{3}$'),

  status text NOT NULL DEFAULT 'pending'
    CHECK (
      status IN (
        'pending',
        'paid',
        'failed',
        'abandoned'
      )
    ),

  authorization_url text,

  provider_response jsonb,

  paid_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_student
  ON public.payment_transactions (student_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_course
  ON public.payment_transactions (course_id);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_status
  ON public.payment_transactions (status);


-- Backend uses the Supabase service-role client.
-- Browser clients must not read or modify payment records directly.
ALTER TABLE public.course_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.course_prices FROM anon, authenticated;
REVOKE ALL ON public.payment_transactions FROM anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.course_prices TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.payment_transactions TO service_role;


-- Finalize a payment and activate the matching enrollment atomically.
-- Call this ONLY after the backend independently verifies the
-- transaction with Paystack and checks amount, currency and reference.

CREATE OR REPLACE FUNCTION public.complete_course_payment(
  p_reference text,
  p_provider_transaction_id text,
  p_provider_response jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payment public.payment_transactions%ROWTYPE;
  v_enrollment_id uuid;
BEGIN
  SELECT *
    INTO v_payment
    FROM public.payment_transactions
   WHERE reference = p_reference
   FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Payment transaction not found';
  END IF;

  -- Do not allow a failed or abandoned payment to be completed.
  IF v_payment.status NOT IN ('pending', 'paid') THEN
    RAISE EXCEPTION 'Payment is not eligible for completion';
  END IF;

  UPDATE public.payment_transactions
     SET status = 'paid',
         provider_transaction_id = p_provider_transaction_id,
         provider_response = p_provider_response,
         paid_at = COALESCE(paid_at, now()),
         updated_at = now()
   WHERE id = v_payment.id;

  INSERT INTO public.enrollments (
    student_id,
    course_id,
    payment_ref,
    payment_provider,
    status
  )
  VALUES (
    v_payment.student_id,
    v_payment.course_id,
    v_payment.reference,
    'paystack',
    'active'
  )
  ON CONFLICT (student_id, course_id)
  DO UPDATE SET
    status = 'active',
    payment_ref = EXCLUDED.payment_ref,
    payment_provider = EXCLUDED.payment_provider
  RETURNING id INTO v_enrollment_id;

  RETURN v_enrollment_id;
END;
$$;

REVOKE ALL ON FUNCTION public.complete_course_payment(text, text, jsonb)
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.complete_course_payment(text, text, jsonb)
  TO service_role;
