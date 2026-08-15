"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Overlay
		ref={ref}
		className={cn(
			"fixed inset-0 z-50 bg-black/50",
			"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
			className,
		)}
		{...props}
	/>
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

const SheetContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<SheetPortal>
		<SheetOverlay />
		<DialogPrimitive.Content
			ref={ref}
			className={cn(
				"fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-[420px] flex-col border-l border-divider bg-bg shadow-elev-lg",
				"data-[state=open]:animate-in data-[state=closed]:animate-out",
				"data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
				"duration-300",
				className,
			)}
			{...props}
		>
			{children}
			<DialogPrimitive.Close
				className="absolute right-3.5 top-3.5 text-muted transition-opacity hover:opacity-100 opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
				aria-label="Close"
			>
				<X className="h-4 w-4" strokeWidth={1.5} />
			</DialogPrimitive.Close>
		</DialogPrimitive.Content>
	</SheetPortal>
));
SheetContent.displayName = DialogPrimitive.Content.displayName;

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"flex flex-none flex-col gap-0.5 border-b border-divider px-4 py-3.5",
				className,
			)}
			{...props}
		/>
	);
}

const SheetTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className={cn("font-heading text-lg font-semibold leading-tight", className)}
		{...props}
	/>
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description
		ref={ref}
		className={cn("text-muted m-0 text-[13px]", className)}
		{...props}
	/>
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription };
