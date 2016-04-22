import { isPresent, isBlank } from 'angular2/src/facade/lang';
import { ListWrapper } from 'angular2/src/facade/collection';
import * as o from '../output/output_ast';
import { Identifiers } from '../identifiers';
import { getPropertyInView } from './util';
class ViewQueryValues {
    constructor(view, values) {
        this.view = view;
        this.values = values;
    }
}
export class CompileQuery {
    constructor(meta, queryList, ownerDirectiveExpression, view) {
        this.meta = meta;
        this.queryList = queryList;
        this.ownerDirectiveExpression = ownerDirectiveExpression;
        this.view = view;
        this._values = new ViewQueryValues(view, []);
    }
    addValue(value, view) {
        var currentView = view;
        var elPath = [];
        var viewPath = [];
        while (isPresent(currentView) && currentView !== this.view) {
            var parentEl = currentView.declarationElement;
            elPath.unshift(parentEl);
            currentView = parentEl.view;
            viewPath.push(currentView);
        }
        var queryListForDirtyExpr = getPropertyInView(this.queryList, viewPath);
        var viewValues = this._values;
        elPath.forEach((el) => {
            var last = viewValues.values.length > 0 ? viewValues.values[viewValues.values.length - 1] : null;
            if (last instanceof ViewQueryValues && last.view === el.embeddedView) {
                viewValues = last;
            }
            else {
                var newViewValues = new ViewQueryValues(el.embeddedView, []);
                viewValues.values.push(newViewValues);
                viewValues = newViewValues;
            }
        });
        viewValues.values.push(value);
        if (elPath.length > 0) {
            view.dirtyParentQueriesMethod.addStmt(queryListForDirtyExpr.callMethod('setDirty', []).toStmt());
        }
    }
    afterChildren(targetMethod) {
        var values = createQueryValues(this._values);
        var updateStmts = [this.queryList.callMethod('reset', [o.literalArr(values)]).toStmt()];
        if (isPresent(this.ownerDirectiveExpression)) {
            var valueExpr = this.meta.first ? this.queryList.prop('first') : this.queryList;
            updateStmts.push(this.ownerDirectiveExpression.prop(this.meta.propertyName).set(valueExpr).toStmt());
        }
        if (!this.meta.first) {
            updateStmts.push(this.queryList.callMethod('notifyOnChanges', []).toStmt());
        }
        targetMethod.addStmt(new o.IfStmt(this.queryList.prop('dirty'), updateStmts));
    }
}
function createQueryValues(viewValues) {
    return ListWrapper.flatten(viewValues.values.map((entry) => {
        if (entry instanceof ViewQueryValues) {
            return mapNestedViews(entry.view.declarationElement.appElement, entry.view, createQueryValues(entry));
        }
        else {
            return entry;
        }
    }));
}
function mapNestedViews(declarationAppElement, view, expressions) {
    var adjustedExpressions = expressions.map((expr) => {
        return o.replaceVarInExpression(o.THIS_EXPR.name, o.variable('nestedView'), expr);
    });
    return declarationAppElement.callMethod('mapNestedViews', [
        o.variable(view.className),
        o.fn([new o.FnParam('nestedView', view.classType)], [new o.ReturnStatement(o.literalArr(adjustedExpressions))])
    ]);
}
export function createQueryList(query, directiveInstance, propertyName, compileView) {
    compileView.fields.push(new o.ClassField(propertyName, o.importType(Identifiers.QueryList), [o.StmtModifier.Private]));
    var expr = o.THIS_EXPR.prop(propertyName);
    compileView.createMethod.addStmt(o.THIS_EXPR.prop(propertyName)
        .set(o.importExpr(Identifiers.QueryList).instantiate([]))
        .toStmt());
    return expr;
}
export function addQueryToTokenMap(map, query) {
    query.meta.selectors.forEach((selector) => {
        var entry = map.get(selector);
        if (isBlank(entry)) {
            entry = [];
            map.add(selector, entry);
        }
        entry.push(query);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZV9xdWVyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtVllsWGhmSzcudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci92aWV3X2NvbXBpbGVyL2NvbXBpbGVfcXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFDLE1BQU0sMEJBQTBCO09BQ3BELEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0NBQWdDO09BRW5ELEtBQUssQ0FBQyxNQUFNLHNCQUFzQjtPQUNsQyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQjtPQVduQyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sUUFBUTtBQUV4QztJQUNFLFlBQW1CLElBQWlCLEVBQVMsTUFBNkM7UUFBdkUsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUFTLFdBQU0sR0FBTixNQUFNLENBQXVDO0lBQUcsQ0FBQztBQUNoRyxDQUFDO0FBRUQ7SUFHRSxZQUFtQixJQUEwQixFQUFTLFNBQXVCLEVBQzFELHdCQUFzQyxFQUFTLElBQWlCO1FBRGhFLFNBQUksR0FBSixJQUFJLENBQXNCO1FBQVMsY0FBUyxHQUFULFNBQVMsQ0FBYztRQUMxRCw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQWM7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFhO1FBQ2pGLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBbUIsRUFBRSxJQUFpQjtRQUM3QyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxNQUFNLEdBQXFCLEVBQUUsQ0FBQztRQUNsQyxJQUFJLFFBQVEsR0FBa0IsRUFBRSxDQUFDO1FBQ2pDLE9BQU8sU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLFdBQVcsS0FBSyxJQUFJLENBQUMsSUFBSSxF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LElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzUHJlc2VudCwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5cbmltcG9ydCAqIGFzIG8gZnJvbSAnLi4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtJZGVudGlmaWVyc30gZnJvbSAnLi4vaWRlbnRpZmllcnMnO1xuXG5pbXBvcnQge1xuICBDb21waWxlUXVlcnlNZXRhZGF0YSxcbiAgQ29tcGlsZUlkZW50aWZpZXJNZXRhZGF0YSxcbiAgQ29tcGlsZVRva2VuTWFwXG59IGZyb20gJy4uL2NvbXBpbGVfbWV0YWRhdGEnO1xuXG5pbXBvcnQge0NvbXBpbGVWaWV3fSBmcm9tICcuL2NvbXBpbGVfdmlldyc7XG5pbXBvcnQge0NvbXBpbGVFbGVtZW50fSBmcm9tICcuL2NvbXBpbGVfZWxlbWVudCc7XG5pbXBvcnQge0NvbXBpbGVNZXRob2R9IGZyb20gJy4vY29tcGlsZV9tZXRob2QnO1xuaW1wb3J0IHtnZXRQcm9wZXJ0eUluVmlld30gZnJvbSAnLi91dGlsJztcblxuY2xhc3MgVmlld1F1ZXJ5VmFsdWVzIHtcbiAgY29uc3RydWN0b3IocHVibGljIHZpZXc6IENvbXBpbGVWaWV3LCBwdWJsaWMgdmFsdWVzOiBBcnJheTxvLkV4cHJlc3Npb24gfCBWaWV3UXVlcnlWYWx1ZXM+KSB7fVxufVxuXG5leHBvcnQgY2xhc3MgQ29tcGlsZVF1ZXJ5IHtcbiAgcHJpdmF0ZSBfdmFsdWVzOiBWaWV3UXVlcnlWYWx1ZXM7XG5cbiAgY29uc3RydWN0b3IocHVibGljIG1ldGE6IENvbXBpbGVRdWVyeU1ldGFkYXRhLCBwdWJsaWMgcXVlcnlMaXN0OiBvLkV4cHJlc3Npb24sXG4gICAgICAgICAgICAgIHB1YmxpYyBvd25lckRpcmVjdGl2ZUV4cHJlc3Npb246IG8uRXhwcmVzc2lvbiwgcHVibGljIHZpZXc6IENvbXBpbGVWaWV3KSB7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3IFZpZXdRdWVyeVZhbHVlcyh2aWV3LCBbXSk7XG4gIH1cblxuICBhZGRWYWx1ZSh2YWx1ZTogby5FeHByZXNzaW9uLCB2aWV3OiBDb21waWxlVmlldykge1xuICAgIHZhciBjdXJyZW50VmlldyA9IHZpZXc7XG4gICAgdmFyIGVsUGF0aDogQ29tcGlsZUVsZW1lbnRbXSA9IFtdO1xuICAgIHZhciB2aWV3UGF0aDogQ29tcGlsZVZpZXdbXSA9IFtdO1xuICAgIHdoaWxlIChpc1ByZXNlbnQoY3VycmVudFZpZXcpICYmIGN1cnJlbnRWaWV3ICE9PSB0aGlzLnZpZXcpIHtcbiAgICAgIHZhciBwYXJlbnRFbCA9IGN1cnJlbnRWaWV3LmRlY2xhcmF0aW9uRWxlbWVudDtcbiAgICAgIGVsUGF0aC51bnNoaWZ0KHBhcmVudEVsKTtcbiAgICAgIGN1cnJlbnRWaWV3ID0gcGFyZW50RWwudmlldztcbiAgICAgIHZpZXdQYXRoLnB1c2goY3VycmVudFZpZXcpO1xuICAgIH1cbiAgICB2YXIgcXVlcnlMaXN0Rm9yRGlydHlFeHByID0gZ2V0UHJvcGVydHlJblZpZXcodGhpcy5xdWVyeUxpc3QsIHZpZXdQYXRoKTtcblxuICAgIHZhciB2aWV3VmFsdWVzID0gdGhpcy5fdmFsdWVzO1xuICAgIGVsUGF0aC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgdmFyIGxhc3QgPVxuICAgICAgICAgIHZpZXdWYWx1ZXMudmFsdWVzLmxlbmd0aCA+IDAgPyB2aWV3VmFsdWVzLnZhbHVlc1t2aWV3VmFsdWVzLnZhbHVlcy5sZW5ndGggLSAxXSA6IG51bGw7XG4gICAgICBpZiAobGFzdCBpbnN0YW5jZW9mIFZpZXdRdWVyeVZhbHVlcyAmJiBsYXN0LnZpZXcgPT09IGVsLmVtYmVkZGVkVmlldykge1xuICAgICAgICB2aWV3VmFsdWVzID0gbGFzdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuZXdWaWV3VmFsdWVzID0gbmV3IFZpZXdRdWVyeVZhbHVlcyhlbC5lbWJlZGRlZFZpZXcsIFtdKTtcbiAgICAgICAgdmlld1ZhbHVlcy52YWx1ZXMucHVzaChuZXdWaWV3VmFsdWVzKTtcbiAgICAgICAgdmlld1ZhbHVlcyA9IG5ld1ZpZXdWYWx1ZXM7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmlld1ZhbHVlcy52YWx1ZXMucHVzaCh2YWx1ZSk7XG5cbiAgICBpZiAoZWxQYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgIHZpZXcuZGlydHlQYXJlbnRRdWVyaWVzTWV0aG9kLmFkZFN0bXQoXG4gICAgICAgICAgcXVlcnlMaXN0Rm9yRGlydHlFeHByLmNhbGxNZXRob2QoJ3NldERpcnR5JywgW10pLnRvU3RtdCgpKTtcbiAgICB9XG4gIH1cblxuICBhZnRlckNoaWxkcmVuKHRhcmdldE1ldGhvZDogQ29tcGlsZU1ldGhvZCkge1xuICAgIHZhciB2YWx1ZXMgPSBjcmVhdGVRdWVyeVZhbHVlcyh0aGlzLl92YWx1ZXMpO1xuICAgIHZhciB1cGRhdGVTdG10cyA9IFt0aGlzLnF1ZXJ5TGlzdC5jYWxsTWV0aG9kKCdyZXNldCcsIFtvLmxpdGVyYWxBcnIodmFsdWVzKV0pLnRvU3RtdCgpXTtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMub3duZXJEaXJlY3RpdmVFeHByZXNzaW9uKSkge1xuICAgICAgdmFyIHZhbHVlRXhwciA9IHRoaXMubWV0YS5maXJzdCA/IHRoaXMucXVlcnlMaXN0LnByb3AoJ2ZpcnN0JykgOiB0aGlzLnF1ZXJ5TGlzdDtcbiAgICAgIHVwZGF0ZVN0bXRzLnB1c2goXG4gICAgICAgICAgdGhpcy5vd25lckRpcmVjdGl2ZUV4cHJlc3Npb24ucHJvcCh0aGlzLm1ldGEucHJvcGVydHlOYW1lKS5zZXQodmFsdWVFeHByKS50b1N0bXQoKSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5tZXRhLmZpcnN0KSB7XG4gICAgICB1cGRhdGVTdG10cy5wdXNoKHRoaXMucXVlcnlMaXN0LmNhbGxNZXRob2QoJ25vdGlmeU9uQ2hhbmdlcycsIFtdKS50b1N0bXQoKSk7XG4gICAgfVxuICAgIHRhcmdldE1ldGhvZC5hZGRTdG10KG5ldyBvLklmU3RtdCh0aGlzLnF1ZXJ5TGlzdC5wcm9wKCdkaXJ0eScpLCB1cGRhdGVTdG10cykpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVF1ZXJ5VmFsdWVzKHZpZXdWYWx1ZXM6IFZpZXdRdWVyeVZhbHVlcyk6IG8uRXhwcmVzc2lvbltdIHtcbiAgcmV0dXJuIExpc3RXcmFwcGVyLmZsYXR0ZW4odmlld1ZhbHVlcy52YWx1ZXMubWFwKChlbnRyeSkgPT4ge1xuICAgIGlmIChlbnRyeSBpbnN0YW5jZW9mIFZpZXdRdWVyeVZhbHVlcykge1xuICAgICAgcmV0dXJuIG1hcE5lc3RlZFZpZXdzKGVudHJ5LnZpZXcuZGVjbGFyYXRpb25FbGVtZW50LmFwcEVsZW1lbnQsIGVudHJ5LnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlUXVlcnlWYWx1ZXMoZW50cnkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxvLkV4cHJlc3Npb24+ZW50cnk7XG4gICAgfVxuICB9KSk7XG59XG5cbmZ1bmN0aW9uIG1hcE5lc3RlZFZpZXdzKGRlY2xhcmF0aW9uQXBwRWxlbWVudDogby5FeHByZXNzaW9uLCB2aWV3OiBDb21waWxlVmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zOiBvLkV4cHJlc3Npb25bXSk6IG8uRXhwcmVzc2lvbiB7XG4gIHZhciBhZGp1c3RlZEV4cHJlc3Npb25zOiBvLkV4cHJlc3Npb25bXSA9IGV4cHJlc3Npb25zLm1hcCgoZXhwcikgPT4ge1xuICAgIHJldHVybiBvLnJlcGxhY2VWYXJJbkV4cHJlc3Npb24oby5USElTX0VYUFIubmFtZSwgby52YXJpYWJsZSgnbmVzdGVkVmlldycpLCBleHByKTtcbiAgfSk7XG4gIHJldHVybiBkZWNsYXJhdGlvbkFwcEVsZW1lbnQuY2FsbE1ldGhvZCgnbWFwTmVzdGVkVmlld3MnLCBbXG4gICAgby52YXJpYWJsZSh2aWV3LmNsYXNzTmFtZSksXG4gICAgby5mbihbbmV3IG8uRm5QYXJhbSgnbmVzdGVkVmlldycsIHZpZXcuY2xhc3NUeXBlKV0sXG4gICAgICAgICBbbmV3IG8uUmV0dXJuU3RhdGVtZW50KG8ubGl0ZXJhbEFycihhZGp1c3RlZEV4cHJlc3Npb25zKSldKVxuICBdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVF1ZXJ5TGlzdChxdWVyeTogQ29tcGlsZVF1ZXJ5TWV0YWRhdGEsIGRpcmVjdGl2ZUluc3RhbmNlOiBvLkV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZTogc3RyaW5nLCBjb21waWxlVmlldzogQ29tcGlsZVZpZXcpOiBvLkV4cHJlc3Npb24ge1xuICBjb21waWxlVmlldy5maWVsZHMucHVzaChuZXcgby5DbGFzc0ZpZWxkKHByb3BlcnR5TmFtZSwgby5pbXBvcnRUeXBlKElkZW50aWZpZXJzLlF1ZXJ5TGlzdCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW28uU3RtdE1vZGlmaWVyLlByaXZhdGVdKSk7XG4gIHZhciBleHByID0gby5USElTX0VYUFIucHJvcChwcm9wZXJ0eU5hbWUpO1xuICBjb21waWxlVmlldy5jcmVhdGVNZXRob2QuYWRkU3RtdChvLlRISVNfRVhQUi5wcm9wKHByb3BlcnR5TmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXQoby5pbXBvcnRFeHByKElkZW50aWZpZXJzLlF1ZXJ5TGlzdCkuaW5zdGFudGlhdGUoW10pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvU3RtdCgpKTtcbiAgcmV0dXJuIGV4cHI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRRdWVyeVRvVG9rZW5NYXAobWFwOiBDb21waWxlVG9rZW5NYXA8Q29tcGlsZVF1ZXJ5W10+LCBxdWVyeTogQ29tcGlsZVF1ZXJ5KSB7XG4gIHF1ZXJ5Lm1ldGEuc2VsZWN0b3JzLmZvckVhY2goKHNlbGVjdG9yKSA9PiB7XG4gICAgdmFyIGVudHJ5ID0gbWFwLmdldChzZWxlY3Rvcik7XG4gICAgaWYgKGlzQmxhbmsoZW50cnkpKSB7XG4gICAgICBlbnRyeSA9IFtdO1xuICAgICAgbWFwLmFkZChzZWxlY3RvciwgZW50cnkpO1xuICAgIH1cbiAgICBlbnRyeS5wdXNoKHF1ZXJ5KTtcbiAgfSk7XG59XG4iXX0=