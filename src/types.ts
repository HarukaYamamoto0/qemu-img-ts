import type { ImageSize } from './core/ImageSize';

export type ImageFormat = 'raw' | 'qcow2' | 'vmdk' | 'vdi' | 'vhdx';

export interface BackingImage {
	/** path to the image file */
	path: string;
	/** Base image format */
	format?: ImageFormat;
	/**
	 * Skips backing file validation when creating the image.
	 *
	 * @default false
	 */
	unsafe?: boolean;
}

/**
 * Options for creating images in the QEMU Copy-On-Write v2 (qcow2) format.
 *
 * qcow2 is a versatile disk image format supporting sparse allocation,
 * compression, internal snapshots, backing files, and optional encryption.
 */
export interface Qcow2Options {
	/**
	 * Specifies the qcow2 specification compatibility level.
	 *
	 * - `"0.10"` / `"v2"`: Legacy format compatible with older QEMU versions (0.10+).
	 * - `"1.1"` / `"v3"`: Modern format (default) supporting advanced features such as zero clusters, lazy refcounts, and extended L2 tables.
	 */
	compat?: '0.10' | '1.1' | 'v2' | 'v3';

	/**
	 * Path or filename of the base/backing image.
	 *
	 * When specified, the newly created image will act as a copy-on-write overlay, storing only changes relative to the base image.
	 */
	backing_file?: string;

	/**
	 * Format of the backing image (e.g., `'qcow2'`, `'raw'`).
	 *
	 * Explicitly specifying the backing format prevents security risks associated with automatic format probing.
	 */
	backing_fmt?: ImageFormat;

	/**
	 * Compression algorithm used for compressed clusters within the image.
	 *
	 * Valid options are `'zlib'` (default) and `'zstd'`.
	 * Note: Images created with `compatibility="0.10"` only support `'zlib'`.
	 */
	compression_type?: 'zlib' | 'zstd';

	/**
	 * Enables legacy 128-bit AES-CBC encryption on the image.
	 *
	 * @deprecated Deprecated in QEMU in favor of LUKS encryption (`encrypt.format=luks`).
	 */
	encryption?: boolean | 'on' | 'off';

	/**
	 * Allocation cluster size in bytes.
	 *
	 * Must be a power of 2 between 512 bytes (512B) and 2 megabytes (2MiB). The default is 64 KiB (65536).
	 * Smaller cluster sizes reduce wasted space for small sparse files, whereas larger cluster sizes offer better I/O performance.
	 */
	cluster_size?: number;

	/**
	 * Preallocation strategy for the disk image:
	 *
	 * - `"off"`: Dynamic allocation without preallocation (sparse file, default).
	 * - `"metadata"`: Preallocates metadata structures while leaving data clusters unallocated.
	 * - `"falloc"`: Preallocates metadata and reserves space on the host filesystem using `posix_fallocate()`.
	 * - `"full"`: Preallocates metadata and writes zeros across all data blocks on physical storage.
	 */
	preallocation?: 'off' | 'metadata' | 'falloc' | 'full';

	/**
	 * Postpones reference count updates in memory to minimize metadata I/O and enhance write performance.
	 *
	 * If the host crashes, reference count tables are automatically rebuilt upon reopening.
	 * Note: Requires `compatibility="1.1"` (`v3`).
	 */
	lazy_refcounts?: boolean | 'on' | 'off';

	/**
	 * Disables filesystem-level Copy-on-Write (COW) by applying the `NOCOW` (`+C`) attribute to new files.
	 *
	 * Primarily intended for Btrfs filesystems to prevent severe fragmentation and performance degradation when hosting VM images.
	 * Valid only on newly created files on supported filesystems.
	 */
	nocow?: boolean | 'on' | 'off';

	/**
	 * Path to an external file where all guest payload data is stored.
	 *
	 * When enabled, the qcow2 container holds only metadata (L1/L2 tables, snapshots), while guest data blocks reside in the external file.
	 * Warning: If the file already exists, it will be overwritten.
	 */
	data_file?: string;

	/**
	 * Ensures the external data file remains consistent and accessible as a standalone raw disk image.
	 *
	 * Forwarding all writes directly at matching offsets preserves a valid raw layout.
	 * Note: Can only be enabled when `dataFile` is specified.
	 */
	data_file_raw?: boolean | 'on' | 'off';

	/**
	 * Enables extended L2 tables (subcluster allocation).
	 *
	 * Divides each cluster into 32 subclusters to allow fine-grained allocation and zero-cluster handling with reduced metadata overhead.
	 * Note: Requires `compatibility="1.1"` (`v3`).
	 */
	extended_l2?: boolean | 'on' | 'off';

	/**
	 * Width of reference counts table entries in bits.
	 *
	 * Allowed values are powers of 2 from 1 to 64 (1, 2, 4, 8, 16, 32, 64), with 16 being the default.
	 * Using smaller values (e.g., 1 or 2 bits) reduces memory overhead for images that do not use internal snapshots.
	 * Note: Requires `compatibility="1.1"` (`v3`).
	 */
	refcount_bits?: number;

	/**
	 * Extent size hint in bytes for the underlying filesystem, or `0` to disable.
	 *
	 * Primarily used on filesystems such as XFS to enforce minimum allocation extent size,
	 * mitigating file fragmentation caused by small random writes over time.
	 */
	extent_size_hint?: ImageSize;

	/** Virtual disk size of the image. */
	size?: ImageSize;
}

/**
 * Options for creating images in the Raw disk format.
 *
 * The raw format is a plain byte-for-byte binary disk image without additional metadata or container headers.
 * It offers maximum performance and broad portability across hypervisors. On filesystems supporting holes (sparse files),
 * unallocated regions do not consume physical disk space.
 */
export interface RawOptions {
	/**
	 * Preallocation strategy for the raw disk image:
	 *
	 * - `"off"`: Dynamic allocation without preallocation (sparse file, default).
	 * - `"falloc"`: Preallocates disk blocks efficiently using the filesystem's `posix_fallocate()` syscall.
	 * - `"full"`: Preallocates disk space by explicitly writing zeros to the underlying physical medium.
	 */
	preallocation?: 'off' | 'falloc' | 'full';

	/**
	 * Disables filesystem-level Copy-on-Write (COW) by applying the `NOCOW` (`+C`) file attribute.
	 *
	 * Primarily intended for Btrfs filesystems to mitigate performance degradation and fragmentation when hosting VM disk images.
	 * Valid only on newly created or empty files on supported filesystems.
	 */
	nocow?: boolean | 'on' | 'off';

	/**
	 * Extent size hint in bytes for the underlying filesystem, or `0` to disable.
	 *
	 * Primarily used on filesystems such as XFS to enforce minimum allocation extent size,
	 * mitigating file fragmentation caused by small random writes over time.
	 */
	extent_size_hint?: ImageSize;

	/** Virtual disk size of the raw image. */
	size?: ImageSize;
}
