/* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * _SDataListMixin enables SData for the List view.
 *
 * Adds the SData store to the view and exposes the needed properties for creating a Feed request.
 *
 * @alternateClassName _SDataListMixin
 * @requires SData
 * @requires utility
 */
define('Sage/Platform/Mobile/_SDataListMixin', [
    'dojo/_base/declare',
    'Sage/Platform/Mobile/Store/SData',
    'Sage/Platform/Mobile/Utility'
], function(
    declare,
    SData,
    utility
) {
    return declare('Sage.Platform.Mobile._SDataListMixin', null, {
        /**
         * @cfg {String} resourceKind
         * The SData resource kind the view is responsible for.  This will be used as the default resource kind
         * for all SData requests.
         */
        resourceKind: '',
        /**
         * @cfg {String[]}
         * A list of fields to be selected in an SData request.
         */
        querySelect: null,
        /**
         * @cfg {String[]?}
         * A list of child properties to be included in an SData request.
         */
        queryInclude: null,
        /**
         * @cfg {String}
         * The default order by expression for an SData request.
         */
        queryOrderBy: null,
        /**
         * @cfg {String/Function}
         * The default where expression for an SData request.
         */
        queryWhere: null,
        /**
         * @cfg {Object}
         * Key/value map of additional query arguments to add to the request.
         * Example:
         *     queryArgs: { _filter: 'Active' }
         *
         *     /sdata/app/dynamic/-/resource?_filter=Active&where=""&format=json
         */
        queryArgs: null,
        /**
         * @cfg {String?/Function?}
         * The default resource property for an SData request.
         */
        resourceProperty: null,
        /**
         * @cfg {String?/Function?}
         * The default resource predicate for an SData request.
         */
        resourcePredicate: null,
        keyProperty: '$key',
        descriptorProperty: '$descriptor',
        /**
         * Creates SDataResourceCollectionRequest instance and sets a number of known properties.
         *
         * List of properties used from `this.property/this.options.property`:
         *
         * `pageSize`, `contractName`, `resourceKind`, `resourceProperty`, `resourcePredicate`, `querySelect/select`,
         * `queryOrderBy/orderBy`, `queryInclude`, `queryWhere/where`, `query`
         *
         * The where parts are joined via `AND`.
         *
         * The Start Index is set by checking the saved `this.items` and if its `$startIndex` and `$itemsPerPage` greater
         * than 0 -- then it adds them together to get the instead. If no feed or not greater than 0 then set the index
         * to 1.
         *
         * @param {object} o Optional request options.
         * @return {Object} Sage.SData.Client.SDataResourceCollectionRequest instance.
         * @deprecated
         */
        createRequest: function(o) {
            // todo: should we cache the request? the only thing that needs to change on subsequent requests is the paging.

            var where = [],
                options = this.options,
                pageSize = this.pageSize,
                startIndex = this.items && this.items['$startIndex'] > 0 && this.items['$itemsPerPage'] > 0
                    ? this.items['$startIndex'] + this.items['$itemsPerPage']
                    : 1;

            var request = new Sage.SData.Client.SDataResourceCollectionRequest(this.getService())
                .setCount(pageSize)
                .setStartIndex(startIndex);

            var contractName = this.expandExpression((options && options.contractName) || this.contractName);
            if (contractName)
                request.setContractName(contractName);

            var resourceKindExpr = this.expandExpression((options && options.resourceKind) || this.resourceKind);
            if (resourceKindExpr)
                request.setResourceKind(resourceKindExpr);

            var resourcePropertyExpr = this.expandExpression((options && options.resourceProperty) || this.resourceProperty);
            if (resourcePropertyExpr)
                request
                    .getUri()
                    .setPathSegment(Sage.SData.Client.SDataUri.ResourcePropertyIndex, resourcePropertyExpr);

            var resourcePredicateExpr = this.expandExpression((options && options.resourcePredicate) || this.resourcePredicate);
            if (resourcePredicateExpr)
                request
                    .getUri()
                    .setCollectionPredicate(resourcePredicateExpr);

            var querySelectExpr = this.expandExpression((options && options.select) || this.querySelect);
            if (querySelectExpr)
                request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Select, querySelectExpr.join(','));

            var queryIncludeExpr = this.expandExpression(this.queryInclude);
            if (queryIncludeExpr)
                request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Include, queryIncludeExpr.join(','));

            var queryOrderByExpr = this.expandExpression((options && options.orderBy) || this.queryOrderBy);
            if (queryOrderByExpr)
                request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.OrderBy, queryOrderByExpr);

            var queryWhereExpr = this.expandExpression((options && options.where) || this.queryWhere);
            if (queryWhereExpr)
                where.push(queryWhereExpr);

            if (this.query)
                where.push(this.query);


            if (where.length > 0)
                request.setQueryArg(Sage.SData.Client.SDataUri.QueryArgNames.Where, where.join(' and '));

            return request;
        },
        createStore: function() {
            return new SData({
                service: this.getConnection(),
                contractName: this.contractName,
                resourceKind: this.resourceKind,
                resourceProperty: this.resourceProperty,
                resourcePredicate: this.resourcePredicate,
                include: this.queryInclude,
                select: this.querySelect,
                where: this.queryWhere,
                queryArgs: this.queryArgs,
                orderBy: this.queryOrderBy,
                idProperty: this.keyProperty,
                scope: this
            });
        },
        _buildQueryExpression: function() {
            var options = this.options,
                passed = options && (options.query || options.where);

            return passed
                ? this.query
                    ? '(' + utility.expand(this, passed) + ') and (' + this.query + ')'
                    : '(' + utility.expand(this, passed) + ')'
                : this.query;
        },
        _applyStateToQueryOptions: function(queryOptions) {
            var options = this.options;
            if (options)
            {
                if (options.select) queryOptions.select = options.select;
                if (options.include) queryOptions.include = options.include;
                if (options.orderBy) queryOptions.sort = options.orderBy;
                if (options.contractName) queryOptions.contractName = options.contractName;
                if (options.resourceKind) queryOptions.resourceKind = options.resourceKind;
                if (options.resourceProperty) queryOptions.resourceProperty = options.resourceProperty;
                if (options.resourcePredicate) queryOptions.resourcePredicate = options.resourcePredicate;
                if (options.queryArgs) queryOptions.queryArgs = options.queryArgs;
            }
        },
        formatSearchQuery: function(query) {
            return query;
        },
        formatHashTagQuery: function(query) {
            var layout = this.get('hashTags') || [],
                queries = [],
                additional = query;

            this.hashTagSearchRE.lastIndex = 0;

            var match;
            while (match = this.hashTagSearchRE.exec(query))
            {
                var tag = match[1],
                    expression = null;

                // todo: can optimize later if necessary
                for (var i = 0; i < layout.length && !expression; i++)
                {
                    if (layout[i].tag == tag) expression = layout[i].query;
                }

                if (!expression) continue;

                queries.push(this.expandExpression(expression));

                additional = additional.replace(match[0], '');
            }

            if (queries.length < 1) return this.formatSearchQuery(query);

            query = '(' + queries.join(') and (') + ')';

            additional = additional.replace(/^\s+|\s+$/g, '');

            if (additional)
            {
                query += ' and (' + this.formatSearchQuery(additional) + ')';
            }

            return query;
        },
        escapeSearchQuery: function(query) {
            return (query || '').replace(/"/g, '""');
        }
    });
});
