/**
 * Options required to initialize a {@link QemuImgError} instance.
 */
export interface QemuImgErrorOptions {
	/**
	 * The command-line arguments passed to the `qemu-img` command.
	 */
	args: string[];

	/**
	 * The exit status code returned by the `qemu-img` process, or `null` if terminated abnormally.
	 */
	exitCode: number | null;

	/**
	 * The standard output captured from the `qemu-img` process.
	 */
	stdout: string;

	/**
	 * The standard error output captured from the `qemu-img` process.
	 */
	stderr: string;

	/**
	 * An optional custom error message. When omitted, an informative default message
	 * containing the exit code and process output is generated automatically.
	 */
	message?: string;
}

/**
 * Represents an error that occurs during the execution of a `qemu-img` command.
 *
 * This error is thrown when the `qemu-img` command exits with a non-zero exit code or fails to execute,
 * capturing the command arguments, exit code, and stdout/stderr output streams for debugging.
 *
 * @example
 * ```ts
 * try {
 *   await runner(['create', '-f', 'raw', 'disk.img', '10G']);
 * } catch (error) {
 *   if (error instanceof QemuImgError) {
 *     console.error(`Command failed with exit code ${error.exitCode}: ${error.stderr}`);
 *   }
 * }
 * ```
 */
export class QemuImgError extends Error {
	/**
	 * The name of the error class.
	 */
	override readonly name = 'QemuImgError';

	/**
	 * The command-line arguments passed to the `qemu-img` command.
	 */
	readonly args: string[];

	/**
	 * The exit status code returned by the `qemu-img` process, or `null` if terminated abnormally.
	 */
	readonly exitCode: number | null;

	/**
	 * The standard output produced by the `qemu-img` process.
	 */
	readonly stdout: string;

	/**
	 * The standard error output produced by the `qemu-img` process.
	 */
	readonly stderr: string;

	/**
	 * Constructs a new `QemuImgError` instance.
	 *
	 * @param {QemuImgErrorOptions} options - The execution details and error context.
	 */
	constructor(options: QemuImgErrorOptions) {
		const detail = options.stderr.trim() || options.stdout.trim();
		const defaultMessage = detail
			? `qemu-img failed with exit code ${options.exitCode}: ${detail}`
			: `qemu-img failed with exit code ${options.exitCode}`;

		super(options.message ?? defaultMessage);

		this.args = options.args;
		this.exitCode = options.exitCode;
		this.stdout = options.stdout;
		this.stderr = options.stderr;

		Object.setPrototypeOf(this, new.target.prototype);
	}
}
