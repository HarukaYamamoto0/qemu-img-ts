# QEMU Img Wrapper

A TypeScript wrapper around [`qemu-img`](https://www.qemu.org/docs/master/tools/qemu-img.html), providing a typed API
for creating, inspecting, and eventually managing disk images without manually building command-line arguments.

> [!WARNING]
> This package is currently under active development and should be considered experimental.
>
> The API may change between releases while the initial design is being stabilized.

## Installation

```bash
npm install qemu-img-ts
```

`qemu-img` must also be installed and available in your system `PATH`.

You can verify it with:

```bash
qemu-img --version
```

## Usage

```ts
import {ImageSize, QemuImg} from "qemu-img-ts";
import type {BlockGraphInfo} from "qemu-img-ts";

const qemu = new QemuImg();

await qemu.create({
	format: "raw",
	outputPath: "./",
	filename: "disk-test.img",
	size: ImageSize.mb(64),
});

const info: BlockGraphInfo | BlockGraphInfo[] = await qemu.info({
	filename: "disk-test.img",
});

if (Array.isArray(info)) {
	console.log(info[0]?.format);
	console.log(info[0]?.virtualSize);
} else {
	console.log(info.format);
	console.log(info.virtualSize);
}
```

The wrapper handles command construction, process execution, and parsing of `qemu-img` output internally.

## Project status

This project is still in its early stages.

A considerable amount of the internal infrastructure is already implemented, but the public API and supported `qemu-img`
functionality are still being developed.

Current work includes support around commands such as:

- `qemu-img create`
- `qemu-img info`
- typed image sizes
- typed command options
- JSON output parsing
- process execution and error handling

More `qemu-img` commands and formats will be added progressively.

Because the project is still young, breaking API changes may occur before a stable release.

## Goals

The project aims to provide a TypeScript-friendly interface over `qemu-img` while keeping the underlying QEMU behavior
accessible.

Instead of:

```bash
qemu-img create -f raw disk.img 67108864
```

the same operation can be expressed as:

```ts
await qemu.create({
	format: "raw",
	filename: "disk.img",
	size: ImageSize.mb(64),
});
```

The goal is not to hide QEMU but to provide a safer and more convenient programmatic interface around it.

## Contributing

Contributions are welcome.

Since the project is still being designed, this is also a good time to discuss API decisions, missing functionality,
format-specific behavior, or other improvements before the public API becomes stable.

Feel free to open an issue for:

- bugs
- feature requests
- API design discussions
- unsupported `qemu-img` options or commands
- documentation improvements

Pull requests are also welcome.

## Requirements

- Node.js-compatible JavaScript runtime
- `qemu-img` installed on the host system

The exact supported Node.js and QEMU versions will be documented as the project matures.

## License

See the repository license for details.