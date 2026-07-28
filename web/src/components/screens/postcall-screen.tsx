"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, UserPlus } from "lucide-react";
import { ROUTES } from "@/constants";
import { useAppState } from "@/hooks/use-app-state";
import { formatDuration } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BlueprintFrame } from "@/components/blueprint/blueprint-frame";
import { CenteredScreen } from "@/components/layout/centered-screen";

export function PostCallScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addRandomFriend } = useAppState();

  const seconds = Number(searchParams.get("d") ?? 0);

  return (
    <CenteredScreen maxWidth={420}>
      <BlueprintFrame className="flex flex-col items-center gap-3.5 p-5 text-center shadow-elev-md">
        <CheckCircle2 className="h-8 w-8 text-accent" strokeWidth={1.5} />
        <h2 className="m-0">Call ended</h2>
        <p className="text-muted m-0">Lasted {formatDuration(seconds)}</p>

        <Button
          variant="primary"
          blueprint
          block
          size="lg"
          onClick={() => router.push(ROUTES.matching)}
        >
          Next stranger
        </Button>

        <Button variant="secondary" block className="gap-1.5" onClick={addRandomFriend}>
          <UserPlus className="h-3.5 w-3.5" strokeWidth={1.5} />
          Add as Friend
        </Button>

        <Button variant="ghost" onClick={() => router.push(ROUTES.landing)}>
          Back to home
        </Button>
      </BlueprintFrame>
    </CenteredScreen>
  );
}
