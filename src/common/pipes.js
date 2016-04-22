'use strict';/**
 * @module
 * @description
 * This module provides a set of common Pipes.
 */
"use strict";
var async_pipe_1 = require('./pipes/async_pipe');
exports.AsyncPipe = async_pipe_1.AsyncPipe;
var date_pipe_1 = require('./pipes/date_pipe');
exports.DatePipe = date_pipe_1.DatePipe;
var json_pipe_1 = require('./pipes/json_pipe');
exports.JsonPipe = json_pipe_1.JsonPipe;
var slice_pipe_1 = require('./pipes/slice_pipe');
exports.SlicePipe = slice_pipe_1.SlicePipe;
var lowercase_pipe_1 = require('./pipes/lowercase_pipe');
exports.LowerCasePipe = lowercase_pipe_1.LowerCasePipe;
var number_pipe_1 = require('./pipes/number_pipe');
exports.NumberPipe = number_pipe_1.NumberPipe;
exports.DecimalPipe = number_pipe_1.DecimalPipe;
exports.PercentPipe = number_pipe_1.PercentPipe;
exports.CurrencyPipe = number_pipe_1.CurrencyPipe;
var uppercase_pipe_1 = require('./pipes/uppercase_pipe');
exports.UpperCasePipe = uppercase_pipe_1.UpperCasePipe;
var replace_pipe_1 = require('./pipes/replace_pipe');
exports.ReplacePipe = replace_pipe_1.ReplacePipe;
var i18n_plural_pipe_1 = require('./pipes/i18n_plural_pipe');
exports.I18nPluralPipe = i18n_plural_pipe_1.I18nPluralPipe;
var i18n_select_pipe_1 = require('./pipes/i18n_select_pipe');
exports.I18nSelectPipe = i18n_select_pipe_1.I18nSelectPipe;
var common_pipes_1 = require('./pipes/common_pipes');
exports.COMMON_PIPES = common_pipes_1.COMMON_PIPES;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLWlFYkZYMXNkLnRtcC9hbmd1bGFyMi9zcmMvY29tbW9uL3BpcGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0dBSUc7O0FBRUgsMkJBQXdCLG9CQUFvQixDQUFDO0FBQXJDLDJDQUFxQztBQUM3QywwQkFBdUIsbUJBQW1CLENBQUM7QUFBbkMsd0NBQW1DO0FBQzNDLDBCQUF1QixtQkFBbUIsQ0FBQztBQUFuQyx3Q0FBbUM7QUFDM0MsMkJBQXdCLG9CQUFvQixDQUFDO0FBQXJDLDJDQUFxQztBQUM3QywrQkFBNEIsd0JBQXdCLENBQUM7QUFBN0MsdURBQTZDO0FBQ3JELDRCQUFpRSxxQkFBcUIsQ0FBQztBQUEvRSw4Q0FBVTtBQUFFLGdEQUFXO0FBQUUsZ0RBQVc7QUFBRSxrREFBeUM7QUFDdkYsK0JBQTRCLHdCQUF3QixDQUFDO0FBQTdDLHVEQUE2QztBQUNyRCw2QkFBMEIsc0JBQXNCLENBQUM7QUFBekMsaURBQXlDO0FBQ2pELGlDQUE2QiwwQkFBMEIsQ0FBQztBQUFoRCwyREFBZ0Q7QUFDeEQsaUNBQTZCLDBCQUEwQixDQUFDO0FBQWhELDJEQUFnRDtBQUN4RCw2QkFBMkIsc0JBQXNCLENBQUM7QUFBMUMsbURBQTBDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbW9kdWxlXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRoaXMgbW9kdWxlIHByb3ZpZGVzIGEgc2V0IG9mIGNvbW1vbiBQaXBlcy5cbiAqL1xuXG5leHBvcnQge0FzeW5jUGlwZX0gZnJvbSAnLi9waXBlcy9hc3luY19waXBlJztcbmV4cG9ydCB7RGF0ZVBpcGV9IGZyb20gJy4vcGlwZXMvZGF0ZV9waXBlJztcbmV4cG9ydCB7SnNvblBpcGV9IGZyb20gJy4vcGlwZXMvanNvbl9waXBlJztcbmV4cG9ydCB7U2xpY2VQaXBlfSBmcm9tICcuL3BpcGVzL3NsaWNlX3BpcGUnO1xuZXhwb3J0IHtMb3dlckNhc2VQaXBlfSBmcm9tICcuL3BpcGVzL2xvd2VyY2FzZV9waXBlJztcbmV4cG9ydCB7TnVtYmVyUGlwZSwgRGVjaW1hbFBpcGUsIFBlcmNlbnRQaXBlLCBDdXJyZW5jeVBpcGV9IGZyb20gJy4vcGlwZXMvbnVtYmVyX3BpcGUnO1xuZXhwb3J0IHtVcHBlckNhc2VQaXBlfSBmcm9tICcuL3BpcGVzL3VwcGVyY2FzZV9waXBlJztcbmV4cG9ydCB7UmVwbGFjZVBpcGV9IGZyb20gJy4vcGlwZXMvcmVwbGFjZV9waXBlJztcbmV4cG9ydCB7STE4blBsdXJhbFBpcGV9IGZyb20gJy4vcGlwZXMvaTE4bl9wbHVyYWxfcGlwZSc7XG5leHBvcnQge0kxOG5TZWxlY3RQaXBlfSBmcm9tICcuL3BpcGVzL2kxOG5fc2VsZWN0X3BpcGUnO1xuZXhwb3J0IHtDT01NT05fUElQRVN9IGZyb20gJy4vcGlwZXMvY29tbW9uX3BpcGVzJztcbiJdfQ==