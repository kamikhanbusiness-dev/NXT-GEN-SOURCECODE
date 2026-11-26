import { ButtonLink, Container } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container className="pt-header pb-28 text-center">
      <p className="font-display text-7xl font-extrabold text-brand-200">404</p>
      <h1 className="mt-4 text-3xl font-bold">This page has gone a bit cold</h1>
      <p className="mt-3 text-slate-600">We couldn&apos;t find the page you were looking for.</p>
      <div className="mt-8 flex justify-center">
        <ButtonLink href="/" icon="arrowRight">Back to home</ButtonLink>
      </div>
    </Container>
  );
}
