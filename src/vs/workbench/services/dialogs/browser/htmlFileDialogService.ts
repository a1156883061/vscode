/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IPickAndOpenOptions, ISaveDialogOptions, IOpenDialogOptions, IFileDialogService, ConfirmResult } from 'vs/platform/dialogs/common/dialogs';
import { URI } from 'vs/base/common/uri';
import { registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { generateUuid } from 'vs/base/common/uuid';
import { HTMLFileSystemDirectoryHandlers, HTMLFileSystemFileHandlers } from 'vs/platform/files/common/htmlFiles';
import { Schemas } from 'vs/base/common/network';
import { IOpenerService } from 'vs/platform/opener/common/opener';

export class HTMLFileDialogService implements IFileDialogService {

	declare readonly _serviceBrand: undefined;

	constructor(
		@IOpenerService protected readonly openerService: IOpenerService,
	) { }

	defaultFilePath(schemeFilter?: string): Promise<URI> {
		throw new Error('Method not implemented.');
	}

	async defaultFolderPath(schemeFilter?: string): Promise<URI> {
		return URI.from({ scheme: Schemas.file });
	}

	defaultWorkspacePath(schemeFilter?: string, filename?: string): Promise<URI> {
		throw new Error('Method not implemented.');
	}

	async pickFileFolderAndOpen(options: IPickAndOpenOptions): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async pickFileAndOpen(options: IPickAndOpenOptions): Promise<void> {
		const [handle] = await window.showOpenFilePicker({ multiple: false });
		const uuid = generateUuid();
		const uri = URI.from({ scheme: Schemas.file, authority: uuid, path: `/${handle.name}` });

		HTMLFileSystemFileHandlers.set(uuid, handle);

		await this.openerService.open(uri, { fromUserGesture: true, editorOptions: { pinned: true } });
	}

	async pickFolderAndOpen(options: IPickAndOpenOptions): Promise<void> {
		const handle = await window.showDirectoryPicker();
		console.log(handle);
	}

	pickWorkspaceAndOpen(options: IPickAndOpenOptions): Promise<void> {
		throw new Error('Method not implemented.');
	}

	pickFileToSave(defaultUri: URI, availableFileSystems?: string[]): Promise<URI | undefined> {
		throw new Error('Method not implemented.');
	}

	showSaveDialog(options: ISaveDialogOptions): Promise<URI | undefined> {
		throw new Error('Method not implemented.');
	}

	showSaveConfirm(fileNamesOrResources: (string | URI)[]): Promise<ConfirmResult> {
		throw new Error('Method not implemented.');
	}

	async showOpenDialog(options: IOpenDialogOptions): Promise<URI[] | undefined> {
		const handle = await window.showDirectoryPicker();
		const uuid = generateUuid();
		const uri = URI.from({ scheme: Schemas.file, authority: uuid, path: `/${handle.name}` });

		HTMLFileSystemDirectoryHandlers.set(uuid, handle);

		return [uri];
	}
}

registerSingleton(IFileDialogService, HTMLFileDialogService, true);
