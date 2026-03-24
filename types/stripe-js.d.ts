// Minimal shim so TypeScript is happy when @stripe/stripe-js is not yet
// installed locally. Vercel will install the real package on deploy.
declare module "@stripe/stripe-js" {
  export function loadStripe(
    publishableKey: string,
    options?: object
  ): Promise<{
    redirectToCheckout(options: { sessionId: string }): Promise<{ error?: Error }>
  } | null>
}
