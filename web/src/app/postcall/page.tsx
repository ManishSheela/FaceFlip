import { Suspense } from "react";
import { PostCallScreen } from "@/components/screens/postcall-screen";

export default function PostCallPage() {
  return (
    <Suspense fallback={null}>
      <PostCallScreen />
    </Suspense>
  );
}
