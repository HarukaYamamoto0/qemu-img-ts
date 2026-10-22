import type { ImageFormat } from '@core/ImageFormat';

/**
 * Configures the backing image (`-b`, `-F`, `-u`).
 *
 * Creates a copy-on-write image that stores only changes
 * relative to the specified backing file.
 *
 * The backing file remains unchanged during image creation.
 */
export interface BackingImage {
	// path to the image file
	path: string;
	// Base image format
	format?: ImageFormat;
	// Skips backing file validation when creating the image (`-u`)
	unsafe?: boolean;
}

export type QemuObjectOptions = Record<string, unknown>;
