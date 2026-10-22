/**
 * The ImageSize class represents a file size in bytes and provides static methods
 * to create instances from common file size units such as gigabytes (GB), gibibytes (GiB),
 * megabytes (MB), and mebibytes (MiB). It encapsulates the size as an immutable value.
 *
 * @example
 * ```ts
 * await qemu.create({
 * 	filename: 'disk-test.img',
 * 	size: ImageSize.mb(64),
 * 	format: ImageFormat.RAW,
 * });
 * ```
 */
export class ImageSize {
	private constructor(readonly bytes: bigint) {
		/* empty */
	}

	/**
	 * Converts the given value in gigabytes (GB) to an instance of ImageSize.
	 *
	 * @param {number} value - The value in gigabytes to be converted.
	 * @return {ImageSize} The resulting ImageSize object representing the value in bytes.
	 */
	static gb(value: number): ImageSize {
		return new ImageSize(BigInt(value) * 1000n ** 3n);
	}

	/**
	 * Converts the given value from gibibytes (GiB) to bytes and returns an ImageSize object.
	 *
	 * @param {number} value - The number of gibibytes to be converted.
	 * @return {ImageSize} An instance of ImageSize with the size in bytes.
	 */
	static gib(value: number): ImageSize {
		return new ImageSize(BigInt(value) * 1024n ** 3n);
	}

	/**
	 * Converts the given value in megabytes to an ImageSize object.
	 *
	 * @param {number} value - The size in megabytes to be converted.
	 * @return {ImageSize} A new ImageSize object representing the size in bytes.
	 */
	static mb(value: number): ImageSize {
		return new ImageSize(BigInt(value) * 1000n ** 2n);
	}

	/**
	 * Converts a given value in mebibytes (MiB) to an ImageSize instance.
	 *
	 * @param {number} value - The value in mebibytes to be converted.
	 * @return {ImageSize} An ImageSize instance representing the value in bytes.
	 */
	static mib(value: number): ImageSize {
		return new ImageSize(BigInt(value) * 1024n ** 2n);
	}

	/**
	 * Converts the byte property of the object to its string representation.
	 *
	 * @return {string} The string representation of the bytes' property.
	 */
	toString(): string {
		return this.bytes.toString();
	}
}
