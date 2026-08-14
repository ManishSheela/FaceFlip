"use client";

import { useRouter } from "next/navigation";
import { GENDER_PREF_OPTIONS, ROUTES } from "@/constants";
import { useSession, useSessionActions } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { BlueprintFrame } from "@/components/blueprint/blueprint-frame";
import { SegmentedControl } from "@/components/blueprint/segmented-control";
import { CenteredScreen } from "@/components/layout/centered-screen";
import type { GenderPref } from "@/types";

export default function GenderPage() {
  const router = useRouter();
  const { genderPref } = useSession();
  const { setGenderPref } = useSessionActions();

  return (
    <CenteredScreen maxWidth={420} background>
      <BlueprintFrame className="flex flex-col gap-[17px] p-5 shadow-elev-md">
        <div>
          <h2 className="m-0 mb-1">Who do you want to meet?</h2>
          <p className="text-muted m-0 text-sm">
            You can change this anytime in Settings.
          </p>
        </div>

        <SegmentedControl
          aria-label="Who do you want to meet?"
          options={GENDER_PREF_OPTIONS}
          value={genderPref}
          onValueChange={(v) => setGenderPref(v as GenderPref)}
          className="w-fit"
        />

        <Button
          variant="primary"
          block
          size="lg"
          onClick={() => router.push(ROUTES.matching)}
        >
          Continue
        </Button>
      </BlueprintFrame>
    </CenteredScreen>
  );
}
