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

define('Sage/Platform/Mobile/TitleBar', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/query',
    'dojo/NodeList-manipulate',
    'dojo/topic',
    'dojo/dom-construct',
    'dojo/dom-style',
    'dojo/dom-class',
    'dojo/dom-attr',
    './Toolbar'
], function(
    declare,
    lang,
    query,
    nodeListManipulate,
    topic,
    domConstruct,
    domStyle,
    domClass,
    domAttr,
    Toolbar
) {
    return declare('Sage.Platform.Mobile.TitleBar', [Toolbar], {
        position: 'top',
        components: [
            {tag: 'h1', attrs: {'class':'toolbar-title'}, attachPoint: 'titleNode'}
        ],
        _setTitleAttr: {node: 'titleNode', type: 'innerHTML'}
    });
});