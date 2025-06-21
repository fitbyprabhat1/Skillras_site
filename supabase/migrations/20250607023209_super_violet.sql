/*
  # Fix RLS policy for leads table

  1. Security Changes
    - Drop existing insert policy for leads table
    - Create new policy that properly allows anonymous users to insert leads
    - Ensure the policy works for both anon and public roles

  This migration fixes the "new row violates row-level security policy" error
  by properly configuring the RLS policy to allow anonymous users to submit
  lead forms through the WelcomePopup component.
*/

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Allow public to insert leads" ON public.leads;

-- Create a new policy that allows anonymous users to insert leads
CREATE POLICY "Allow anonymous users to insert leads"
  ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Also allow authenticated users to insert leads (for completeness)
CREATE POLICY "Allow authenticated users to insert leads"
  ON public.leads
  FOR INSERT
  TO authenticated
  WITH CHECK (true);