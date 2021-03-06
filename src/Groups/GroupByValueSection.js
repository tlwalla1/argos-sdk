﻿/*
    Swiftpage Partner Source License
    Copyright 2013 Swiftpage ACT! LLC.  All rights reserved.
    
    Swiftpage does not charge for use of the Software licensed herein. Charges for any other software or services will be set forth in a separate written agreement between the parties. Software license granted to you herein is contingent upon your acknowledgement and agreement to the terms herein.  If you do not agree to these terms, you do not have the permission to use the Software in any manner.  You acknowledge and agree to the following: (i) Swiftpage provides the Software free of charge and without any obligation of technical support or maintenance; (ii) Swiftpage does not guarantee the accuracy, completeness, and reliability of the Software or whether the Software is virus-free; (iii) Swiftpage makes no representation about whether the Software has been tested (either internally or via beta test) for quality assurance or quality control, (iv) Swiftpage does not guarantee that the Software does not infringe any third party rights; (v) you may experience bugs, errors, loss or corruption of data, and difficulty in use, and (vi) you shall have sole responsibility for protection and preservation of your data and files.
 
    You are not permitted to use the Software in any product that competes in any way, in Swiftpage's opinion, with a Swiftpage product.  Subject to that exception, redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met: (A) Redistributions of source code must retain the above copyright notice, this sentence and the following Disclaimer; and (B) Redistributions in binary form must reproduce the above copyright notice, this sentence and the following Disclaimer in the documentation and/or other materials provided with the distribution. Neither the names of ACT!, Swiftpage, any of Swiftpage's product/service names, nor the names of the contributors to the Software may be used to endorse or promote products/services derived from this Software without specific prior written permission of Swiftpage. Disclaimer: THE SOFTWARE IS ACCEPTED BY YOU "AS IS" AND "WITH ALL FAULTS". ALL WARRANTIES CONCERNING THE SOFTWARE, EXPRESS OR IMPLIED, STATUTORY, OR IN ANY OTHER PROVISION OF THIS AGREEMENT INCLUDING, WITHOUT LIMITATION, ANY WARRANTY OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY, OR FITNESS FOR A PARTICULAR PURPOSE, ARE HEREBY EXPRESSLY DISCLAIMED AND EXCLUDED. WHETHER OR NOT ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, SWIFTPAGE SHALL NOT UNDER ANY CIRCUMSTANCE BE LIABLE TO YOU OR ANY OTHER PARTY FOR ANY SPECIAL, INDIRECT, INCIDENTAL, PUNITIVE OR CONSEQUENTIAL DAMAGES OF ANY KIND, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF GOODWILL, LOST PROFITS, LOST DATA, WORK STOPPAGE OR COMPUTER HARDWARE OR SOFTWARE DAMAGE, FAILURE OR MALFUNCTION, EVEN IF SWIFTPAGE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES AND NOTWITHSTANDING THE FAILURE OF ESSENTIAL PURPOSE OF ANY LIMITED REMEDY.

    You acknowledge that Swiftpage retains and is not transferring to you any title to or ownership rights in or to any intellectual property in the Software, any modifications thereto, or copies thereof.  Swiftpage may terminate this Agreement, in its sole discretion. Upon termination of this Agreement, you shall return to Swiftpage, or destroy, all originals and copies of all Software (including any support materials furnished by Swiftpage), permanently purge all machine-readable copies of the Software from all computers and storage devices, and to certify to Sage in writing that the foregoing duties have been performed and that you will not in any way use or permit the use of the Software. This Agreement shall be governed by the laws of the State of Colorado.
 */

/**
 * @class Sage.Platform.Mobile.Groups.GroupByValueSection
 */
define('Sage/Platform/Mobile/Groups/GroupByValueSection', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/string',
    'Sage/Platform/Mobile/Convert',
    'Sage/Platform/Mobile/Utility',
    'Sage/Platform/Mobile/Groups/_GroupBySection'
], function(
    declare,
    lang,
    string,
    Convert,
    Utility,
    _GroupBySection
) {

    return declare('Sage.Platform.Mobile.Groups.GroupByValueSection', [_GroupBySection], {
        name: 'DateTimeSectionFilter',        
        displayNameText: 'Group By Value Section',
        width:0,
        constructor: function(o) {
            this.groupByProperty = o.groupByProperty;
            this.sortDirection = o.sortDirection;
            if (o.width) {
                this.width = o.width;
            }
            this.init();
        },
        init: function() {
            this.sections = [];
        },
        getSection: function(entry) {
            var value;
            if ((this.groupByProperty) && (entry)) {
                value = Utility.getValue(entry, this.groupByProperty);
                value = this._getValueFromWidth(value, this.width);
                if (value) {
                    return { key: value, title: value };
                }
                else {
                    return this.getDefaultSection();
                }
            }
            return null;
        },
        getDefaultSection:function(){
            return { key: 'Unknown', title: 'Unknown' }
        },
        _getValueFromWidth:function(value, width){
            if (value) {
                if (width > 0) {
                    value =value.toString().substring(0,width);
                }
            }
            return value;
        }
        
    });
});
