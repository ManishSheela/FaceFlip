"use client";

import { useState } from "react";
import { Bell, Crown, User, UserCircle, UserPlus, Video } from "lucide-react";
import {
	CAMERA_DEVICES,
	GENDER_PREF_OPTIONS,
	MICROPHONE_DEVICES,
	PREMIUM_GATED_GENDER_PREFS,
	THEME_OPTIONS,
	USER_GENDER_OPTIONS,
} from "@/constants";
import { useSession, useSessionActions } from "@/hooks/use-session";
import { useTheme } from "@/hooks/use-theme";
import { startGoogleLogin } from "@/lib/api-service";
import { daysRemaining, getInitials } from "@/lib/utils";
import { PremiumGateDialog } from "@/components/dialogs/premium-gate-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Avatar } from "@/components/blueprint/avatar";
import { Tag } from "@/components/blueprint/tag";
import { SectionCard } from "@/components/blueprint/section-card";
import { SegmentedControl } from "@/components/blueprint/segmented-control";
import { ToggleRow } from "@/components/blueprint/toggle-row";
import { GoogleIcon } from "@/components/icons/google-icon";

const ICON = { className: "h-[13px] w-[13px]", strokeWidth: 1.5 } as const;

interface SettingsDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SettingsDrawer({ open, onOpenChange }: SettingsDrawerProps) {
	const { theme, setTheme } = useTheme();
	const {
		isAuthenticated,
		userGender,
		genderPref,
		profileName,
		profileEmail,
		isPremium,
		premiumExpiresAt,
	} = useSession();
	const { setUserGender, setGenderPref, setProfileName } = useSessionActions();

	const [camDevice, setCamDevice] = useState(CAMERA_DEVICES[0].value);
	const [micDevice, setMicDevice] = useState(MICROPHONE_DEVICES[0].value);
	const [notifyMatches, setNotifyMatches] = useState(true);
	const [notifyUpdates, setNotifyUpdates] = useState(false);
	const [gateOpen, setGateOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Settings</SheetTitle>
					<SheetDescription>
						Manage your account, preferences and devices.
					</SheetDescription>
				</SheetHeader>

				<div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto p-4">
					{isAuthenticated ? (
						<SectionCard
							kicker="Profile"
							icon={<User {...ICON} />}
							bodyClassName="p-0"
						>
							<div className="flex flex-wrap items-center gap-4 p-4">
								<div className="flex flex-col items-center gap-1.5">
									<Avatar initials={getInitials(profileName)} size={60} framed />
									<Tag variant="accent" className="text-[10px]">
										Verified
									</Tag>
								</div>
								<div className="flex min-w-[180px] flex-1 flex-col gap-2.5">
									<div className="flex flex-col gap-1">
										<Label htmlFor="drawer-displayName">Display name</Label>
										<Input
											id="drawer-displayName"
											value={profileName}
											onChange={(e) => setProfileName(e.target.value)}
										/>
									</div>
									<div className="flex flex-col gap-1">
										<Label htmlFor="drawer-email">Email</Label>
										<Input
											id="drawer-email"
											value={profileEmail}
											readOnly
											className="opacity-60"
										/>
									</div>
								</div>
							</div>
						</SectionCard>
					) : (
						<SectionCard
							kicker="Guest session"
							icon={<User {...ICON} />}
							bodyClassName="p-0"
						>
							<div className="flex flex-col items-start gap-3.5 p-4">
								<p className="text-muted m-0 text-sm">
									Sign in to save preferences, access friends and keep chat
									history.
								</p>
								<Button
									variant="primary"
									className="gap-1.5"
									onClick={startGoogleLogin}
								>
									<GoogleIcon size={15} />
									Sign in with Google
								</Button>
							</div>
						</SectionCard>
					)}

					{isAuthenticated && (
						<SectionCard kicker="Your gender" icon={<User {...ICON} />}>
							<div className="flex flex-col gap-2.5">
								<p className="text-muted m-0 text-[13px]">
									Shown on your profile. Set during sign-in.
								</p>
								<SegmentedControl
									aria-label="Your gender"
									options={USER_GENDER_OPTIONS}
									value={userGender ?? USER_GENDER_OPTIONS[0].value}
									onValueChange={setUserGender}
								/>
							</div>
						</SectionCard>
					)}

					{isAuthenticated && (
						<SectionCard kicker="Match preference" icon={<UserPlus {...ICON} />}>
							<div className="flex flex-col gap-2.5">
								<p className="text-muted m-0 text-[13px]">
									Who do you want to be matched with?
								</p>
								{isPremium && premiumExpiresAt && (
									<div className="text-muted flex items-center gap-1.5 text-[12px]">
										<Crown className="h-3 w-3 text-amber" strokeWidth={1.5} />
										Premium active · {daysRemaining(premiumExpiresAt)} days left
									</div>
								)}
								<SegmentedControl
									aria-label="Match preference"
									options={GENDER_PREF_OPTIONS}
									value={genderPref}
									onValueChange={setGenderPref}
									lockedValues={isPremium ? [] : PREMIUM_GATED_GENDER_PREFS}
									onLockedSelect={() => setGateOpen(true)}
								/>
							</div>
						</SectionCard>
					)}

					<SectionCard kicker="Appearance" icon={<UserCircle {...ICON} />}>
						<div className="flex flex-col gap-2.5">
							<p className="text-muted m-0 text-[13px]">
								Choose your preferred colour scheme.
							</p>
							<SegmentedControl
								aria-label="Appearance"
								options={THEME_OPTIONS}
								value={theme}
								onValueChange={setTheme}
								className="w-fit"
							/>
						</div>
					</SectionCard>

					<SectionCard kicker="Camera & microphone" icon={<Video {...ICON} />}>
						<div className="flex flex-col gap-3.5">
							<div className="flex flex-col gap-1">
								<Label>Camera device</Label>
								<Select value={camDevice} onValueChange={setCamDevice}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{CAMERA_DEVICES.map((device) => (
											<SelectItem key={device.value} value={device.value}>
												{device.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col gap-1">
								<Label>Microphone device</Label>
								<Select value={micDevice} onValueChange={setMicDevice}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{MICROPHONE_DEVICES.map((device) => (
											<SelectItem key={device.value} value={device.value}>
												{device.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</SectionCard>

					<SectionCard kicker="Notifications" icon={<Bell {...ICON} />}>
						<div className="flex flex-col gap-3.5">
							<ToggleRow
								title="New match found"
								description="Alert when someone is ready to connect"
								checked={notifyMatches}
								onCheckedChange={setNotifyMatches}
							/>
							<div className="h-px bg-divider" />
							<ToggleRow
								title="Product updates"
								description="News about features and improvements"
								checked={notifyUpdates}
								onCheckedChange={setNotifyUpdates}
							/>
						</div>
					</SectionCard>
				</div>
			</SheetContent>

			<PremiumGateDialog open={gateOpen} onOpenChange={setGateOpen} />
		</Sheet>
	);
}
