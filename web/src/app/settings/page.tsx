"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
	Bell,
	ChevronLeft,
	User,
	UserCircle,
	UserPlus,
	Video,
} from "lucide-react";
import {
	API_URL,
	CAMERA_DEVICES,
	GENDER_PREF_LABELS,
	MICROPHONE_DEVICES,
	ROUTES,
	USER_GENDER_OPTIONS,
} from "@/constants";
import { useSession, useSessionActions } from "@/hooks/use-session";
import { useTheme } from "@/hooks/use-theme";
import { getInitials } from "@/lib/utils";
import type { GenderPref, Theme } from "@/types";
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
import { Avatar } from "@/components/blueprint/avatar";
import { Tag } from "@/components/blueprint/tag";
import { SectionCard } from "@/components/blueprint/section-card";
import { SegmentedControl } from "@/components/blueprint/segmented-control";
import { ToggleRow } from "@/components/blueprint/toggle-row";
import { GoogleIcon } from "@/components/icons/google-icon";

const ICON = { className: "h-[13px] w-[13px]", strokeWidth: 1.5 } as const;

const GENDER_OPTIONS: { label: string; value: GenderPref }[] = [
	{ label: "Male", value: "male" },
	{ label: "Female", value: "female" },
	{ label: GENDER_PREF_LABELS.random, value: "random" },
];

const THEME_OPTIONS: { label: string; value: Theme }[] = [
	{ label: "Light", value: "light" },
	{ label: "Dark", value: "dark" },
];

export function SettingsScreen() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const fromCall = searchParams.get("from") === "call";

	const { theme, setTheme } = useTheme();
	const {
		isAuthenticated,
		userGender,
		genderPref,
		profileName,
		profileEmail,
		camDevice,
		micDevice,
		notifyMatches,
		notifyUpdates,
	} = useSession();
	const {
		setUserGender,
		setGenderPref,
		setProfileName,
		setCamDevice,
		setMicDevice,
		toggleNotifyMatches,
		toggleNotifyUpdates,
	} = useSessionActions();

	const close = () => router.push(fromCall ? ROUTES.call : ROUTES.landing);

	return (
		<section className="mx-auto flex w-full max-w-[720px] animate-fade-slide-in flex-col gap-[17px] px-3.5 pb-16 pt-5">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-divider pb-3.5">
				<div>
					<h2 className="m-0 mb-0.5">Settings</h2>
					<p className="text-muted m-0 text-[13px]">
						Manage your account, preferences and devices.
					</p>
				</div>
				<Button variant="secondary" onClick={close}>
					<ChevronLeft {...ICON} />
					{fromCall ? "Back to call" : "Close"}
				</Button>
			</div>

			{isAuthenticated ? (
				<SectionCard
					kicker="Profile"
					icon={<User {...ICON} />}
					bodyClassName="p-0"
				>
					<div className="flex flex-wrap items-center gap-5 p-4">
						<div className="flex flex-col items-center gap-1.5">
							<Avatar initials={getInitials(profileName)} size={72} framed />
							<Tag variant="accent" className="text-[10px]">
								Verified
							</Tag>
						</div>
						<div className="flex min-w-[200px] flex-1 flex-col gap-2.5">
							<div className="flex flex-col gap-1">
								<Label htmlFor="displayName">Display name</Label>
								<Input
									id="displayName"
									value={profileName}
									onChange={(e) => setProfileName(e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-1">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
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
					<div className="flex flex-wrap items-center justify-between gap-3.5 p-4">
						<p className="text-muted m-0 max-w-[340px] text-sm">
							Sign in to save preferences, access friends and keep chat history.
						</p>
						<Button
							variant="primary"
							blueprint
							className="gap-1.5"
							onClick={() => {
								window.location.href = `${API_URL}/auth/google`;
							}}
						>
							<GoogleIcon size={15} />
							Sign in with Google
						</Button>
					</div>
				</SectionCard>
			)}

			{/* Preference + Appearance */}
			<div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
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
							<SegmentedControl
								aria-label="Match preference"
								options={GENDER_OPTIONS}
								value={genderPref}
								onValueChange={setGenderPref}
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
			</div>

			{/* Camera & microphone */}
			<SectionCard kicker="Camera & microphone" icon={<Video {...ICON} />}>
				<div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
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

			{/* Notifications */}
			<SectionCard kicker="Notifications" icon={<Bell {...ICON} />}>
				<div className="flex flex-col gap-3.5">
					<ToggleRow
						title="New match found"
						description="Alert when someone is ready to connect"
						checked={notifyMatches}
						onCheckedChange={toggleNotifyMatches}
					/>
					<div className="h-px bg-divider" />
					<ToggleRow
						title="Product updates"
						description="News about features and improvements"
						checked={notifyUpdates}
						onCheckedChange={toggleNotifyUpdates}
					/>
				</div>
			</SectionCard>
		</section>
	);
}
