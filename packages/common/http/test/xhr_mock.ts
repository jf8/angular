/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {HttpHeaders} from '../src/headers';
import {XhrFactory} from '../src/xhr';

export class MockXhrFactory implements XhrFactory {
  mock: MockXMLHttpRequest;

  build(): XMLHttpRequest { return (this.mock = new MockXMLHttpRequest()) as any; }
}

export class MockXMLHttpRequestUpload {
  constructor(private mock: MockXMLHttpRequest) {}

  addEventListener(event: 'progress', handler: Function) {
    this.mock.addEventListener('uploadProgress', handler);
  }

  removeEventListener(event: 'progress', handler: Function) {
    this.mock.removeEventListener('uploadProgress');
  }
}

export class MockXMLHttpRequest {
  // Set by method calls.
  body: any;
  method: string;
  url: string;
  mockHeaders: {[key: string]: string} = {};
  mockAborted: boolean = false;

  // Directly settable interface.
  withCredentials: boolean = false;
  responseType: string = 'text';

  // Mocked response interface.
  response: any|undefined = undefined;
  responseText: string|undefined = undefined;
  responseURL: string|null = null;
  status: number = 0;
  statusText: string = '';
  mockResponseHeaders: string = '';

  listeners: {
    error?: (event: ErrorEvent) => void,
    load?: () => void,
    progress?: (event: ProgressEvent) => void,
    uploadProgress?: (event: ProgressEvent) => void,
  } = {};

  upload = new MockXMLHttpRequestUpload(this);

  open(method: string, url: string): void {
    this.method = method;
    this.url = url;
  }

  send(body: any): void { this.body = body; }

  addEventListener(event: 'error'|'load'|'progress'|'uploadProgress', handler: Function): void {
    this.listeners[event] = handler as any;
  }

  removeEventListener(event: 'error'|'load'|'progress'|'uploadProgress'): void {
    delete this.listeners[event];
  }

  setRequestHeader(name: string, value: string): void { this.mockHeaders[name] = value; }

  getAllResponseHeaders(): string { return this.mockResponseHeaders; }

  getResponseHeader(header: string): string|null {
    return new HttpHeaders(this.mockResponseHeaders).get(header);
  }

  mockFlush(status: number, statusText: string, body: any|null) {
    if (this.responseType === 'text') {
      this.responseText = body;
    } else {
      this.response = body;
    }
    this.status = status;
    this.statusText = statusText;
    this.mockLoadEvent();
  }

  mockDownloadProgressEvent(loaded: number, total?: number): void {
    if (this.listeners.progress) {
      this.listeners.progress({ lengthComputable: total !== undefined, loaded, total } as any);
    }
  }

  mockUploadProgressEvent(loaded: number, total?: number) {
    if (this.listeners.uploadProgress) {
      this.listeners.uploadProgress(
          { lengthComputable: total !== undefined, loaded, total, } as any);
    }
  }

  mockLoadEvent(): void {
    if (this.listeners.load) {
      this.listeners.load();
    }
  }

  mockErrorEvent(error: any): void {
    if (this.listeners.error) {
      this.listeners.error(error);
    }
  }

  abort() { this.mockAborted = true; }
}