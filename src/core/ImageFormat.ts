// noinspection JSUnusedGlobalSymbols

import type { ImageSize } from './ImageSize';

// Represents the supported image formats for virtual disk files
export enum ImageFormat {
	// Represents an uncompressed raw disk image
	RAW = 'raw',
	// A format developed by QEMU with support for compression, snapshots, and encryption
	QCOW2 = 'qcow2',
	// Virtual Machine Disk format used by VMware products
	VMDK = 'vmdk',
	// VirtualBox Disk Image format used by Oracle VirtualBox
	VDI = 'vdi',
	// Virtual Hard Disk format, an updated version of VHD, used by Microsoft Hyper-V
	VHDX = 'vhdx',
}

/**
 * Just a parent class used as a generic interface; use the interfaces that inherit from this interface
 * it has the prefix `Options`, for example, `OptionsRaw`, `OptionsQcow2`, etc.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ImageOptions {}

// Supported raw options
export interface OptionsRaw extends ImageOptions {
	// Size of the virtual disk
	size: ImageSize;
}

// Supported raw options
export interface OptionsQcow2 extends ImageOptions {
	// Path or filename of the base backing image
	backing_file: string;
	// Format of the base backing image
	backing_format: string;
	// Cluster size for the qcow2 image
	cluster_size: ImageSize;
	// QCOW2 compatibility level (v2 [0.10] or v3 [1.1])
	compat: string;
	// Compression algorithm used for cluster data
	compression_type: string;
	// Path or filename of the external data file
	data_file: string;
	// Ensure external data file stays valid as a raw image
	data_file_raw: boolean;
	encrypt: {
		// Cipher algorithm used for encryption
		cipher_alg: string;
		// Cipher mode used for encryption
		cipher_mode: string;
		// Encryption format ('aes' or 'luks')
		format: string;
		// Hash algorithm used for encryption
		hash_alg: string;
		// Time spent in PBKDF (in milliseconds)
		iter_time: number;
		// IV generator algorithm
		ivgen_alg: string;
		// Hash algorithm for the IV generator
		ivgen_hash_alg: string;
		// Secret ID containing the AES key or LUKS passphrase
		key_secret: string;
		// Enable AES encryption (deprecated, use encrypt.format='aes')
		encryption: boolean;
	};
	// Enable extended L2 entries/tables
	extended_l2: boolean;
	// Postpone refcount table updates
	lazy_refcounts: boolean;
	// Image preallocation mode (off, metadata, falloc, full)
	preallocation: string;
	// A bit width of reference count entries
	refcount_bits: number;
	// Size of the virtual disk
	size: ImageSize;
}

// Supported luks options
export interface OptionsLuks extends ImageOptions {
	// Cipher algorithm used for encryption
	cipher_alg: string;
	// Cipher mode used for encryption
	cipher_mode: string;
	// Hash algorithm used for encryption
	hash_alg: string;
	// Time spent in PBKDF (in milliseconds)
	iter_time: number;
	// IV generator algorithm
	ivgen_alg: string;
	// Hash algorithm for the IV generator
	ivgen_hash_alg: string;
	// Secret ID that provides the keyslot passphrase
	key_secret: string;
	// Size of the virtual disk
	size: ImageSize;
}

// Supported qed options
export interface OptionsQed extends ImageOptions {
	// Path or filename of the base backing image
	backing_file: string;
	// Format of the base backing image
	backing_format: string;
	// Cluster size (in bytes)
	cluster_size: ImageSize;
	// Size of the virtual disk
	size: ImageSize;
	// Size of L1/L2 tables (in clusters)
	table_size: ImageSize;
}

// Supported qcow options
export interface OptionsQcow extends ImageOptions {
	// Path or filename of the base backing image
	backing_file: string;
	// Format of the backing image
	backing_fmt: string;
	encrypt: {
		// Encryption format ('aes')
		format: string;
		// Secret ID that provides the AES encryption key
		keySecret: string;
	};
	// Enable AES encryption (deprecated, use encrypt.format='aes')
	encryption: boolean;
	// Size of the virtual disk
	size: ImageSize;
}

// Supported vdi options
export interface OptionsVdi extends ImageOptions {
	// Size of the virtual disk
	size: ImageSize;
	// Pre-allocate a static VDI image
	static: boolean;
}

// Supported vmdk options
export interface OptionsVmdk extends ImageOptions {
	// Virtual adapter type: ide (default), lsilogic, buslogic, or legacyESX
	adapter_type: string;
	// Path or filename of the base backing image
	backing_file: string;
	// Backing format (must be 'vmdk' if specified)
	backing_fmt: string;
	// Compatibility with VMDK version 6
	compat6: boolean;
	// VMDK hardware version compatibility
	hwversion: string;
	// Size of the virtual disk
	size: ImageSize;
	// VMDK extent format: monolithicSparse (default), monolithicFlat, twoGbMaxExtentSparse, twoGbMaxExtentFlat, or streamOptimized
	subformat: string;
	// VMware guest tools version
	toolsversion: string;
	// Enable zeroed-grain GTE feature for optimized zero writes
	zeroed_grain: boolean;
}

// Supported vpc options
export interface OptionsVpc extends ImageOptions {
	// Force the exact disk size rather than rounding to the nearest CHS geometry
	force_size: boolean;
	// Size of the virtual disk
	size: ImageSize;
	// Virtual hard disk format type: dynamic (default) or fixed
	subformat: string;
}

// Supported VHDX options
export interface OptionsVhdx extends ImageOptions {
	// Block size between 1MB and 256MB (0 auto-calculates from image size)
	block_size: ImageSize;
	// Force payload blocks of the type 'ZERO' (default). Do not disable with qemu-img convert and subformat=dynamic
	block_state_zero: boolean;
	// Log size (minimum 1MB)
	log_size: ImageSize;
	// Size of the virtual disk (up to 64TB)
	size: ImageSize;
	// VHDX format type: dynamic (default) or fixed
	subformat: string;
}
