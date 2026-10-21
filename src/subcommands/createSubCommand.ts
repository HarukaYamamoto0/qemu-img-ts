import path from 'node:path';
import { runner } from '../core/runner';
import type { BackingImage, ImageFormat, Qcow2Options, RawOptions } from '../types';
import type { ImageSize } from '../core/ImageSize';
import { objectToParams } from '../helpers/objectToParams';

export interface CreateImageOptions {
	format: ImageFormat;
	backing?: BackingImage;
	additionalParams?: Qcow2Options | RawOptions;
	outputPath: string;
	filename: string;
	size: ImageSize;
}

/**
 * Creates a sub-command to generate a new image file with specified options.
 *
 * @param {CreateImageOptions} options - The configuration options for creating the image.
 *
 * @return {Promise<void>} A promise that resolves when the sub-command is successfully executed.
 * @see https://qemu-project.gitlab.io/qemu/tools/qemu-img.html#cmdoption-qemu-img-commands-arg-create
 */
export async function createSubCommand(options: CreateImageOptions): Promise<void> {
	const args = ['create', '-f', options.format];

	if (options.backing !== undefined) {
		args.push('-b'); // active backing option
		args.push(options.backing.path); // path to the base image

		if (options.backing.format !== undefined) {
			args.push('-F'); // flag for passing the format
			args.push(options.backing.format); // base image format
		}

		if (options.backing.unsafe === true) args.push('-u');
	}

	args.push('-q'); // quiet mode

	if (options.additionalParams !== undefined) {
		const params = objectToParams(options.additionalParams);

		args.push('-o');
		args.push(params.substring(0, params.length - 1)); // and remove last ","
	}

	args.push(path.join(options.outputPath, options.filename)); // path to file output
	args.push(String(options.size)); // define size

	await runner(args);
}
