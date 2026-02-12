/*
 * Copyright 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use it except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * JSON2HTML Content block – decorates content rendered by the JSON2HTML overlay
 * (https://www.aem.live/developer/json2html). Use with BYOM Mustache templates
 * that output this block's markup.
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const applyRowClass = (row, className) => {
    row.classList.add(className);
    const cell = row.querySelector(':scope > div');
    if (cell) cell.classList.add(`${className}-inner`);
  };

  rows.forEach((row, index) => {
    const hasImage = row.querySelector('img');
    const hasList = row.querySelector('ul, ol');
    const hasLink = row.querySelector('a[href]');

    if (index === 0 && !hasImage && !hasList) {
      applyRowClass(row, 'json2html-content-title');
    } else if (hasImage) {
      applyRowClass(row, 'json2html-content-image');
      row.querySelectorAll('picture, img').forEach((media) => {
        media.closest('div')?.classList.add('json2html-content-media');
      });
    } else if (hasList) {
      applyRowClass(row, 'json2html-content-list');
    } else if (hasLink && row.textContent?.trim().length < 200) {
      applyRowClass(row, 'json2html-content-cta');
    } else {
      applyRowClass(row, 'json2html-content-body');
    }
  });
}
