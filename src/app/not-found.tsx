import { Button } from "@/components/ui";
export default function NotFound() {
  return (
    <div className="container not-found">
      <h1>This page isn’t here.</h1>
      <p>Let’s get you back to the property information you need.</p>
      <Button href="/">Back to Home</Button>
    </div>
  );
}
