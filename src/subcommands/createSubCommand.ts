import type { ImageFormat, ImageOptions } from '@core/ImageFormat';
import type { BackingImage, QemuObjectOptions } from '../types';
import type { ImageSize } from '@core/ImageSize';
import { objectToParams } from '@helpers/objectToParams';
import { runner } from '@core/runner';

/**
 * Options for creating a new disk image using the `qemu-img create` command.
 *
 * Supports configuring the image format, virtual disk size,
 * backing file, format-specific options, and QEMU user-creatable objects.
 *
 * @see {@link https://qemu-project.gitlab.io/qemu/tools/qemu-img.html#cmdoption-qemu-img-commands-arg-create | QEMU Documentation}
 */
export interface CreateImageOptions {
	/**
	 * Defines a QEMU user-creatable object (`--object`).
	 *
	 * Objects provide auxiliary resources, such as encryption keys
	 * and secrets, that can be referenced by image format options.
	 *
	 * @see {@link https://qemu-project.gitlab.io/qemu/tools/qemu-img.html#cmdoption-qemu-img-common-opts-object | QEMU Object Documentation}
	 */
	object?: QemuObjectOptions;

	/**
	 * Specifies the disk image format (`-f`).
	 *
	 * Determines how the image is stored and which format-specific
	 * options are available.
	 */
	format?: ImageFormat;

	/**
	 * Configures the backing image (`-b`, `-F`).
	 *
	 * Creates a copy-on-write image that stores only changes
	 * relative to the specified backing file.
	 *
	 * The backing file remains unchanged during image creation.
	 */
	backing?: BackingImage;

	/**
	 * Specifies additional format-specific options (`-o`).
	 *
	 * Available options depend on the selected image format.
	 * These options are serialized as comma-separated key-value pairs.
	 *
	 * @example
	 * "cluster_size=65536,lazy_refcounts=on"
	 */
	options?: ImageOptions;

	/**
	 * Path to the disk image to create.
	 *
	 * Can be an absolute or relative filesystem path.
	 */
	filename: string;

	/**
	 * Specifies the virtual disk size.
	 *
	 * Supports sizes in bytes and QEMU size suffixes such as
	 * `K`, `M`, `G`, and `T`.
	 *
	 * The size may be omitted when a backing image is provided
	 * or when specified through format-specific options.
	 *
	 * @example
	 * "64M"
	 * @example
	 * "10G"
	 */
	size: ImageSize; // TODO: should be optional, but it does require some form of validation.
}

/**
 * Creates an offline disk image in formats such as `raw`, `qcow2`, among others
 *
 * @example
 * ```ts
 * await qemu.create({
 * 	filename: 'disk-test.img',
 * 	size: ImageSize.mb(64),
 * 	format: ImageFormat.RAW,
 * });
 * ```
 *
 * @return {Promise<void>} A promise that resolves when the command is successfully executed.
 */
export async function createSubCommand(inputOptions: CreateImageOptions): Promise<void> {
	const args = ['create'];

	if (inputOptions.object !== undefined) {
		args.push('--object', objectToParams(inputOptions.object));
	}

	args.push('-q');
	if (inputOptions.format !== undefined) args.push('-f', inputOptions.format);

	if (inputOptions.backing !== undefined) {
		args.push('-b'); // active backing option
		args.push(inputOptions.backing.path); // path to the base image

		if (inputOptions.backing.format !== undefined) {
			args.push('-F'); // flag for passing the format
			args.push(inputOptions.backing.format); // base image format
		}

		// this option only makes sense if the backing file exists, which is why it is included here within this conditional
		if (inputOptions.backing.unsafe === true) args.push('-u');
	}

	if (inputOptions.options !== undefined) args.push('-o', objectToParams(inputOptions.options));

	args.push(inputOptions.filename); // path to file output
	args.push(String(inputOptions.size)); // define size

	await runner(args);
}
