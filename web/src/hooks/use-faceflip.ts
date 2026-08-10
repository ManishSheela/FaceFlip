"use client";

import { useContext } from "react";
import { FaceFlipContext, type FaceFlipValue } from "@/context/faceflip-provider";

export function useFaceFlip(): FaceFlipValue {
	const ctx = useContext(FaceFlipContext);
	if (!ctx) {
		throw new Error("useFaceFlip must be used within a <FaceFlipProvider>");
	}
	return ctx;
}
