import { createSubCommand } from '@subcommands/createSubCommand';
import { infoSubCommand } from '@subcommands/infoSubCommand';

export class QemuImg {
	create = createSubCommand;
	info = infoSubCommand;
}
