import type { ImageFormat } from '@core/ImageFormat';
import type { QemuObjectOptions } from '../types';
import { objectToParams } from '@helpers/objectToParams';
import { runner } from '@core/runner';

export interface InfoImageOptions {
	object?: QemuObjectOptions;
	imageOpts?: boolean;
	format?: ImageFormat;
	backingChain?: boolean;
	forceShare?: boolean;
	filename: string;
}

// info [--object objectdef] [--image-opts] [-f fmt] [--output=ofmt] [--backing-chain] [-U] filename
export async function infoSubCommand(options: InfoImageOptions): Promise<BlockGraphInfo | BlockGraphInfo[]> {
	const args = ['info'];

	if (options.object !== undefined) args.push('--object', objectToParams(options.object));
	if (options.imageOpts === true) args.push('--image-opts');
	if (options.format !== undefined) args.push('-f', options.format);

	args.push('--output=json');

	if (options.backingChain === true) args.push('--backing-chain');
	if (options.forceShare === true) args.push('-U');

	args.push(options.filename);

	const stdout: string = await runner(args);
	const parsed: QemuBlockGraphInfo | QemuBlockGraphInfo[] = JSON.parse(stdout);

	if (Array.isArray(parsed)) {
		const items: BlockGraphInfo[] = [];
		for (const qemuBlockGraphInfo of parsed) {
			items.push({
				filename: qemuBlockGraphInfo.filename,
				format: qemuBlockGraphInfo.format,
				virtualSize: qemuBlockGraphInfo['virtual-size'],
				actualSize: qemuBlockGraphInfo['actual-size'],
				dirtyFlag: qemuBlockGraphInfo['dirty-flag'],
				clusterSize: qemuBlockGraphInfo['cluster-size'],
				encrypted: qemuBlockGraphInfo.encrypted,
				compressed: qemuBlockGraphInfo.compressed,
				backingFilename: qemuBlockGraphInfo['backing-filename'],
				fullBackingFilename: qemuBlockGraphInfo['full-backing-filename'],
				backingFilenameFormat: qemuBlockGraphInfo['backing-filename-format'],
				snapshots: qemuBlockGraphInfo.snapshots,
				formatSpecific: qemuBlockGraphInfo['format-specific'],
			} as BlockGraphInfo);
		}
		return items;
	} else {
		return {
			filename: parsed.filename,
			format: parsed.format,
			virtualSize: parsed['virtual-size'],
			actualSize: parsed['actual-size'],
			dirtyFlag: parsed['dirty-flag'],
			clusterSize: parsed['cluster-size'],
			encrypted: parsed.encrypted,
			compressed: parsed.compressed,
			backingFilename: parsed['backing-filename'],
			fullBackingFilename: parsed['full-backing-filename'],
			backingFilenameFormat: parsed['backing-filename-format'],
			snapshots: parsed.snapshots,
			formatSpecific: parsed['format-specific'],
		} as BlockGraphInfo;
	}
}

export interface BlockGraphInfo {
	filename: string;
	format: string;
	virtualSize: number;
	actualSize?: number;
	dirtyFlag?: boolean;
	clusterSize?: number;
	encrypted?: boolean;
	compressed?: boolean;
	backingFilename?: string;
	fullBackingFilename?: string;
	backingFilenameFormat?: string;
	snapshots?: QemuSnapshotInfo[];
	formatSpecific?: QemuFormatSpecific;
}

export interface QemuBlockNodeInfo {
	filename: string;
	format: string;
	'virtual-size': number;
	'actual-size'?: number;
	'dirty-flag'?: boolean;
	'cluster-size'?: number;
	encrypted?: boolean;
	compressed?: boolean;
	'backing-filename'?: string;
	'full-backing-filename'?: string;
	'backing-filename-format'?: string;
	snapshots?: QemuSnapshotInfo[];
	'format-specific'?: QemuFormatSpecific;
}

export interface QemuBlockGraphInfo extends QemuBlockNodeInfo {
	children: QemuBlockChildInfo[];
}

export interface QemuBlockChildInfo {
	name: string;
	info: QemuBlockGraphInfo;
}

export interface QemuSnapshotInfo {
	id: string;
	name: string;
	'vm-state-size': number;
	'date-sec': number;
	'date-nsec': number;
	'vm-clock-sec': number;
	'vm-clock-nsec': number;
	icount?: number;
}

export type QemuFormatSpecific =
	| { type: 'qcow2'; data: QemuQcow2Info }
	| { type: 'vmdk'; data: QemuVmdkInfo }
	| { type: 'luks'; data: QemuLuksInfo }
	| { type: 'rbd'; data: QemuRbdInfo }
	| { type: 'file'; data: QemuFileInfo };

export interface QemuQcow2Info {
	compat: string;
	'refcount-bits': number;
	'compression-type': 'zlib' | 'zstd';

	'data-file'?: string;
	'data-file-raw'?: boolean;
	'extended-l2'?: boolean;
	'lazy-refcounts'?: boolean;
	corrupt?: boolean;

	encrypt?: { format: 'aes' } | ({ format: 'luks' } & QemuLuksInfo);

	bitmaps?: {
		name: string;
		granularity: number;
		flags: ('in-use' | 'auto')[];
	}[];
}

export interface QemuVmdkInfo {
	'create-type': string;
	cid: number;
	'parent-cid': number;
	extents: {
		filename: string;
		format: string;
		'virtual-size': number;
		'cluster-size'?: number;
		compressed?: boolean;
	}[];
}

export interface QemuFileInfo {
	'extent-size-hint'?: number;
}

export interface QemuRbdInfo {
	'encryption-format'?: 'luks' | 'luks2' | 'luks-any';
}

export interface QemuLuksInfo {
	'cipher-alg': QemuCipherAlgorithm;
	'cipher-mode': 'ecb' | 'cbc' | 'xts' | 'ctr';
	'ivgen-alg': 'plain' | 'plain64' | 'essiv';
	'ivgen-hash-alg'?: QemuHashAlgorithm;
	'hash-alg': QemuHashAlgorithm;
	'payload-offset': number;
	'master-key-iters': number;
	uuid: string;
	slots: {
		active: boolean;
		'key-offset': number;
		iters?: number;
		stripes?: number;
	}[];
}

export type QemuHashAlgorithm = 'md5' | 'sha1' | 'sha224' | 'sha256' | 'sha384' | 'sha512' | 'ripemd160';

export type QemuCipherAlgorithm =
	| 'aes-128'
	| 'aes-192'
	| 'aes-256'
	| 'des'
	| '3des'
	| 'cast5-128'
	| 'serpent-128'
	| 'serpent-192'
	| 'serpent-256'
	| 'twofish-128'
	| 'twofish-192'
	| 'twofish-256';
