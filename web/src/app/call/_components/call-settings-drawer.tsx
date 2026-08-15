"use client";

import { useState } from "react";
import { USER_GENDER_OPTIONS } from "@/constants";
import { useSession, useSessionActions } from "@/hooks/use-session";
import { cn, getInitials } from "@/lib/utils";
import type { UserGender } from "@/types";
import { CornerBrackets } from "@/components/blueprint/corner-brackets";
import { CallDrawer } from "./call-drawer";

const MONO_LABEL =
	"font-heading text-[10px] uppercase tracking-[0.06em] text-call-muted";
const FIELD_BOX =
	"border border-call-panel bg-call-divider px-3 py-2.5 text-[13px] text-white";

interface ToggleRowProps {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}

function DrawerToggle({ label, checked, onChange }: ToggleRowProps) {
	return (
		<label className="flex cursor-pointer items-center justify-between rounded-md bg-call-divider p-3">
			<span className="text-xs font-semibold text-white">{label}</span>
			<button
				type="button"
				role="switch"
				aria-checked={checked}
				aria-label={label}
				onClick={() => onChange(!checked)}
				className={cn(
					"relative h-5 w-9 flex-none rounded-full transition-colors",
					checked ? "bg-accent" : "bg-call-panel",
				)}
			>
				<span
					className={cn(
						"absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
						checked ? "left-[18px]" : "left-0.5",
					)}
				/>
			</button>
		</label>
	);
}

interface CallSettingsDrawerProps {
	onClose: () => void;
}

export function CallSettingsDrawer({ onClose }: CallSettingsDrawerProps) {
	const { profileName, profileEmail, userGender } = useSession();
	const { setProfileName, setUserGender } = useSessionActions();

	const [name, setName] = useState(profileName);
	const [gender, setGender] = useState<UserGender | null>(userGender);
	const [notifications, setNotifications] = useState(true);
	const [showOnline, setShowOnline] = useState(true);

	const save = () => {
		setProfileName(name);
		if (gender) setUserGender(gender);
		onClose();
	};

	return (
		<CallDrawer title="Settings" onClose={onClose}>
			<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
				<div className="flex flex-col items-center gap-2.5 border-b border-call-divider pb-4">
					<div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent-2 bg-accent-100 font-heading text-xl font-semibold text-white">
						{getInitials(name || profileName)}
					</div>
					<span className="text-[13px] font-semibold text-white">
						{profileEmail}
					</span>
				</div>

				<div className="flex flex-col gap-3">
					<div className="flex flex-col gap-1.5">
						<label htmlFor="drawer-name" className={MONO_LABEL}>
							Display name
						</label>
						<div className="relative">
							<CornerBrackets size={5} color="var(--color-accent-400)" />
							<input
								id="drawer-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className={cn(
									FIELD_BOX,
									"w-full outline-none focus-visible:border-accent",
								)}
							/>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<span className={MONO_LABEL}>Gender</span>
						<div className="flex gap-1.5">
							{USER_GENDER_OPTIONS.map((option) => {
								const active = option.value === gender;
								return (
									<button
										key={option.value}
										type="button"
										onClick={() => setGender(option.value)}
										className={cn(
											"relative flex-1 cursor-pointer py-2.5 text-center text-xs font-semibold transition-colors",
											active
												? "bg-accent text-on-accent"
												: "bg-call-divider text-call-muted hover:text-white",
										)}
									>
										<CornerBrackets
											size={5}
											color={active ? "var(--color-on-accent)" : "var(--color-accent-400)"}
										/>
										{option.label}
									</button>
								);
							})}
						</div>
					</div>

					<DrawerToggle
						label="Notifications"
						checked={notifications}
						onChange={setNotifications}
					/>
					<DrawerToggle
						label="Show online status"
						checked={showOnline}
						onChange={setShowOnline}
					/>
				</div>

				<button
					type="button"
					onClick={save}
					className="relative mt-1 w-full cursor-pointer border-none bg-accent py-3 font-heading text-[13px] font-bold text-on-accent transition-colors hover:bg-accent-600"
				>
					<CornerBrackets size={6} color="var(--color-on-accent)" />
					Save changes
				</button>
			</div>
		</CallDrawer>
	);
}
