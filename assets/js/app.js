        const TAG_COLORS = [
            { bg: 'rgba(99, 102, 241, 0.15)', text: '#a5b4fc', border: 'rgba(99, 102, 241, 0.25)' }, 
            { bg: 'rgba(16, 185, 129, 0.15)', text: '#6ee7b7', border: 'rgba(16, 185, 129, 0.25)' }, 
            { bg: 'rgba(245, 158, 11, 0.15)', text: '#fcd34d', border: 'rgba(245, 158, 11, 0.25)' }, 
            { bg: 'rgba(239, 68, 68, 0.15)', text: '#fca5a5', border: 'rgba(239, 68, 68, 0.25)' },   
            { bg: 'rgba(14, 165, 233, 0.15)', text: '#7dd3fc', border: 'rgba(14, 165, 233, 0.25)' }
        ];

        const ICONS = {
            trash: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>`,
            edit: `<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>`,
            export: `<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>`,
            chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M19 9l-7 7-7-7" /></svg>`,
            chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M9 5l7 7-7 7" /></svg>`,
            tag: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>`,
            external: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>`,
            maximize: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.4"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3m8 0h3a2 2 0 002-2v-3" /></svg>`
        };

        function getTagStyle(tagName) {
            let hash = 0; for (let i = 0; i < tagName.length; i++) hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
            const color = TAG_COLORS[Math.abs(hash) % TAG_COLORS.length]; return `background: ${color.bg}; color: ${color.text}; border-color: ${color.border};`;
        }

        function escapeHtml(value) {
            return String(value ?? '').replace(/[&<>"']/g, (char) => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[char]));
        }

        function jsString(value) {
            return `'${String(value ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, ' ')}'`;
        }

        function showToast(msg) {
            const t = document.getElementById('toast'); t.textContent = msg; t.style.opacity = '1'; t.style.transform = 'translate(-50%, -10px)';
            setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translate(-50%, 0)'; }, 2000);
        }

        function openConfirmModal(message, action) {
            const container = document.getElementById('modal-container');
            container.classList.remove('hidden'); container.classList.add('flex');
            document.querySelectorAll('#modal-container > div').forEach(el => el.classList.add('hidden'));
            const modal = document.getElementById('confirm-modal');
            document.getElementById('confirmMessage').textContent = message;
            modal.classList.remove('hidden');
            window.appState.pendingAction = action;
            document.getElementById('executeConfirmBtn').onclick = () => {
                if(window.appState.pendingAction) window.appState.pendingAction();
                closeModal();
            };
        }

        function closeModal() { 
            const c = document.getElementById('modal-container');
            c.classList.add('hidden'); c.classList.remove('flex');
            document.querySelectorAll('#modal-container > div').forEach(el => el.classList.add('hidden')); 
            document.querySelectorAll('#modal-container input').forEach(el => el.value = ''); 
            window.appState.pendingAction = null;
            window.appState.exportingBoardId = null;
        }

        function openNewBoardModal() { const c = document.getElementById('modal-container'); c.classList.remove('hidden'); c.classList.add('flex'); document.querySelectorAll('#modal-container > div').forEach(el => el.classList.add('hidden')); document.getElementById('new-board-modal').classList.remove('hidden'); document.getElementById('newBoardName').focus(); }
        function openNewFolderModal() { const c = document.getElementById('modal-container'); c.classList.remove('hidden'); c.classList.add('flex'); document.querySelectorAll('#modal-container > div').forEach(el => el.classList.add('hidden')); document.getElementById('new-folder-modal').classList.remove('hidden'); document.getElementById('newFolderName').focus(); }
        function openRenameModal(id, currentName, isBoard, e) {
            if(e) e.stopPropagation(); const c = document.getElementById('modal-container'); c.classList.remove('hidden'); c.classList.add('flex');
            document.querySelectorAll('#modal-container > div').forEach(el => el.classList.add('hidden')); const modal = document.getElementById('rename-modal'); const input = document.getElementById('renameInput'); input.value = currentName; modal.classList.remove('hidden'); input.focus();
            document.getElementById('confirmRenameBtn').onclick = async () => {
                const name = input.value.trim(); if(!name) return; const data = JSON.parse(JSON.stringify(window.appState.appData));
                if(isBoard) { const b = data.boards.find(b => String(b.id) === String(id)); if(b) b.name = name; } else { const f = data.folders.find(f => String(f.id) === String(id)); if(f) f.name = name; }
                await window.saveData(data); closeModal(); showToast("変更しました");
            };
        }
        function openHelpModal() { const c = document.getElementById('modal-container'); c.classList.remove('hidden'); c.classList.add('flex'); document.querySelectorAll('#modal-container > div').forEach(el => el.classList.add('hidden')); document.getElementById('help-modal').classList.remove('hidden'); }

        function openExportBoardModal(id, e) {
            if(e) e.stopPropagation();
            const board = window.appState.appData.boards.find(b => String(b.id) === String(id));
            if(!board) return;
            window.appState.exportingBoardId = id;
            const c = document.getElementById('modal-container');
            c.classList.remove('hidden'); c.classList.add('flex');
            document.querySelectorAll('#modal-container > div').forEach(el => el.classList.add('hidden'));
            const modal = document.getElementById('export-board-modal');
            const input = document.getElementById('exportFileName');
            input.value = `board_${board.name.replace(/[\s\W]/g, '_')}`;
            modal.classList.remove('hidden');
            input.focus();
        }

        function confirmExportBoard() {
            const id = window.appState.exportingBoardId;
            const filename = document.getElementById('exportFileName').value.trim() || 'board_export';
            const board = window.appState.appData.boards.find(b => String(b.id) === String(id));
            if(!board) return;
            const exportData = { type: 'single_board', version: '1.0', data: board };
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const link = document.createElement('a');
            link.setAttribute('href', dataUri);
            link.setAttribute('download', `${filename}.json`);
            link.click();
            closeModal();
            showToast('ボードを書き出しました');
        }

        async function confirmCreateBoard() {
            const name = document.getElementById('newBoardName').value.trim(); if (!name) return;
            const newId = Date.now().toString(); const data = JSON.parse(JSON.stringify(window.appState.appData));
            data.boards.push({ id: newId, name: name, posts: [], folderId: null }); data.activeBoardId = newId;
            await window.saveData(data); closeModal(); showToast("ボード作成完了");
        }
        async function confirmCreateFolder() {
            const name = document.getElementById('newFolderName').value.trim(); if (!name) return;
            const newId = 'folder-' + Date.now().toString(); const data = JSON.parse(JSON.stringify(window.appState.appData));
            data.folders.push({ id: newId, name: name, expanded: true });
            await window.saveData(data); closeModal(); showToast("フォルダ作成完了");
        }

        function selectBoard(id) {
            const boardId = String(id); const data = JSON.parse(JSON.stringify(window.appState.appData));
            data.activeBoardId = boardId; window.appState.searchQuery = ""; window.appState.selectedTags = [];
            const input = document.getElementById('searchInput'); if (input) input.value = "";
            window.saveData(data); if (window.innerWidth < 768) toggleSidebar();
        }
        function toggleSidebar() { document.getElementById('sidebar').classList.toggle('closed'); }
        function handleSearch(val) { window.appState.searchQuery = val.toLowerCase(); renderActiveBoard(); }
        function clearTagFilters() {
            window.appState.selectedTags = [];
            if (window.appState.isFilterExpanded) updateFilterTagsUI();
            renderActiveBoard();
        }

        function selectTagFilter(tag) {
            const tags = window.appState.selectedTags;
            const idx = tags.indexOf(tag);
            if (idx === -1) tags.push(tag);
            else tags.splice(idx, 1);
            window.appState.selectedTags = tags;
            if (window.appState.isFilterExpanded) updateFilterTagsUI();
            renderActiveBoard();
        }
        function toggleSearch() {
            const input = document.getElementById('searchInput'); window.appState.isSearchExpanded = !window.appState.isSearchExpanded;
            if (window.appState.isSearchExpanded) { input.classList.replace('w-0', 'w-64'); input.classList.replace('opacity-0', 'opacity-100'); input.classList.add('px-3'); input.focus(); }
            else { input.classList.replace('w-64', 'w-0'); input.classList.replace('opacity-100', 'opacity-0'); input.classList.remove('px-3'); }
        }
        function handleSearchMouseLeave() { const input = document.getElementById('searchInput'); if (!input.value && window.appState.isSearchExpanded) toggleSearch(); }
        function toggleFilter() {
            const list = document.getElementById('tagFilterList'); const btn = document.getElementById('filterToggleBtn'); window.appState.isFilterExpanded = !window.appState.isFilterExpanded;
            if (window.appState.isFilterExpanded) { list.classList.add('expanded'); btn.classList.add('bg-indigo-500/10', 'text-indigo-400'); updateFilterTagsUI(); }
            else { list.classList.remove('expanded'); btn.classList.remove('bg-indigo-500/10', 'text-indigo-400'); }
        }

        function handleDragStartPost(id, e) {
            window.appState.draggedPostId = id; window.appState.draggedBoardId = null;
            e.dataTransfer.setData('text/plain', id); e.dataTransfer.effectAllowed = 'move';
            document.body.classList.add('dragging-active'); e.currentTarget.classList.add('dragging');
        }
        function handleDragStartBoard(id, e) {
            window.appState.draggedBoardId = id; window.appState.draggedPostId = null;
            e.dataTransfer.setData('text/plain', id); e.dataTransfer.effectAllowed = 'move';
            e.currentTarget.classList.add('dragging');
        }
        function handleDragEnd(e) {
            document.body.classList.remove('dragging-active'); e.currentTarget.classList.remove('dragging');
            document.querySelectorAll('.bookmark-card, .sidebar-item').forEach(el => el.classList.remove('drag-over'));
        }
        function handleDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; e.currentTarget.classList.add('drag-over'); }
        function handleDragLeave(e) { e.currentTarget.classList.remove('drag-over'); }

        async function handleDropPostOnPost(targetPostId, e) {
            e.preventDefault(); const draggedId = window.appState.draggedPostId;
            if (!draggedId || draggedId === targetPostId) return;
            const data = JSON.parse(JSON.stringify(window.appState.appData));
            const board = data.boards.find(b => String(b.id) === String(data.activeBoardId));
            if (!board) return;
            const fromIdx = board.posts.findIndex(p => p.id === draggedId);
            const toIdx = board.posts.findIndex(p => p.id === targetPostId);
            if (fromIdx !== -1 && toIdx !== -1) { const [moved] = board.posts.splice(fromIdx, 1); board.posts.splice(toIdx, 0, moved); await window.saveData(data); }
        }

        async function handleDropOnSidebarItem(itemId, isBoard, e) {
            e.preventDefault(); const data = JSON.parse(JSON.stringify(window.appState.appData));
            if (window.appState.draggedPostId && isBoard) {
                const src = data.boards.find(b => String(b.id) === String(data.activeBoardId));
                const tgt = data.boards.find(b => String(b.id) === String(itemId));
                if (!src || !tgt || src.id === tgt.id) return;
                const orig = src.posts.find(p => p.id === window.appState.draggedPostId);
                if (orig && !tgt.posts.some(p => p.url === orig.url)) {
                    tgt.posts.unshift({ ...orig, id: Date.now().toString() + Math.random().toString(36).substr(2, 5) });
                    await window.saveData(data); showToast(`${tgt.name} に複製しました`);
                }
            } else if (window.appState.draggedBoardId && isBoard) {
                const fromIdx = data.boards.findIndex(b => String(b.id) === String(window.appState.draggedBoardId));
                const toIdx = data.boards.findIndex(b => String(b.id) === String(itemId));
                if (fromIdx !== -1 && toIdx !== -1) { const [moved] = data.boards.splice(fromIdx, 1); moved.folderId = data.boards[toIdx > fromIdx ? toIdx : toIdx]?.folderId || null; data.boards.splice(toIdx, 0, moved); await window.saveData(data); }
            } else if (window.appState.draggedBoardId && !isBoard) {
                const board = data.boards.find(b => String(b.id) === String(window.appState.draggedBoardId));
                if (board) { board.folderId = itemId; await window.saveData(data); }
            }
        }

        function renderSidebar() {
            const list = document.getElementById('boardList'); if (!list) return; list.innerHTML = '';
            const data = window.appState.appData;
            const renderItem = (item, isBoard) => {
                const isActive = isBoard && String(item.id) === String(data.activeBoardId);
                const div = document.createElement('div');
                div.className = `sidebar-item group ${isActive ? 'active-board' : ''}`;
                if (isBoard) {
                    div.setAttribute('draggable', 'true'); div.ondragstart = (e) => handleDragStartBoard(item.id, e);
                    div.onclick = () => selectBoard(item.id);
                } else { div.onclick = (e) => toggleFolder(item.id, e); }
                div.ondragover = handleDragOver; div.ondragleave = handleDragLeave;
                div.ondrop = (e) => { e.currentTarget.classList.remove('drag-over'); handleDropOnSidebarItem(item.id, isBoard, e); };
                div.ondragend = handleDragEnd;
                let icon = isBoard 
                    ? `<span class="mr-2" style="opacity:0.4"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M8 9h8m-8 6h8" /></svg></span>` 
                    : `<span class="mr-2" style="color:var(--text-muted)">${item.expanded ? ICONS.chevronDown : ICONS.chevronRight}</span>`;
                
                const itemId = escapeHtml(jsString(item.id));
                const itemName = escapeHtml(jsString(item.name));
                let actions = `<div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all" style="color:var(--text-secondary)">`;
                if(isBoard) {
                    actions += `<button onclick="openExportBoardModal(${itemId}, event)" class="p-1.5 rounded-md transition-colors hover:text-amber-400 hover:bg-amber-400/10" title="ボードを書き出す" aria-label="ボードを書き出す">${ICONS.export}</button>`;
                }
                actions += `<button onclick="openRenameModal(${itemId}, ${itemName}, ${isBoard}, event)" class="p-1.5 rounded-md transition-colors hover:text-blue-400 hover:bg-blue-400/10" aria-label="名前を変更">${ICONS.edit}</button><button onclick="${isBoard?'deleteBoard':'deleteFolder'}(${itemId}, event)" class="p-1.5 rounded-md transition-colors hover:text-red-400 hover:bg-red-400/10" aria-label="削除">${ICONS.trash}</button></div>`;
                
                div.innerHTML = `<div class="truncate flex items-center min-w-0">${icon}<span class="text-xs font-semibold truncate">${escapeHtml(item.name)}</span></div>${actions}`;
                return div;
            };
            data.folders.forEach(f => {
                list.appendChild(renderItem(f, false));
                if (f.expanded) {
                    const sub = document.createElement('div'); sub.className = "folder-indent space-y-0.5 mb-3 mt-0.5";
                    data.boards.filter(b => String(b.folderId) === String(f.id)).forEach(b => sub.appendChild(renderItem(b, true))); list.appendChild(sub);
                }
            });
            const roots = data.boards.filter(b => !b.folderId);
            if (roots.length > 0) {
                const d = document.createElement('div'); d.className = "sidebar-section-label mt-6 mb-2 px-1";
                d.textContent = "未分類"; list.appendChild(d); roots.forEach(b => list.appendChild(renderItem(b, true)));
            }
        }

        function parseYouTubeId(url) {
            // 通常: youtube.com/watch?v=ID, youtu.be/ID, /embed/ID, /shorts/ID
            const patterns = [
                /[?&]v=([a-zA-Z0-9_-]{11})/,
                /youtu\.be\/([a-zA-Z0-9_-]{11})/,
                /\/embed\/([a-zA-Z0-9_-]{11})/,
                /\/shorts\/([a-zA-Z0-9_-]{11})/,
            ];
            for (const p of patterns) {
                const m = url.match(p);
                if (m) return m[1];
            }
            return null;
        }

        function playYouTube(postId, youtubeId) {
            const media = document.getElementById(`youtube-media-${postId}`);
            if (!media || media.querySelector('iframe')) return;

            const card = media.closest('.bookmark-card');
            if (card) card.classList.add('is-active');

            const thumbnail = media.querySelector('.youtube-thumb-wrap');
            if (!thumbnail) return;

            thumbnail.outerHTML = `
                <iframe
                    class="youtube-embed"
                    src="https://www.youtube.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    allowfullscreen="true"
                    webkitallowfullscreen="true"
                    mozallowfullscreen="true"
                ></iframe>`;
        }

        function requestElementFullscreen(el) {
            const fn = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
            if (!fn) return Promise.reject(new Error('Fullscreen is not supported'));
            return fn.call(el);
        }

        function openYouTubeFullscreen(postId, youtubeId, e) {
            if (e) e.stopPropagation();
            playYouTube(postId, youtubeId);

            const media = document.getElementById(`youtube-media-${postId}`);
            if (!media) return;

            Promise.resolve(requestElementFullscreen(media)).catch(() => {
                showToast("このブラウザでは全画面表示を開始できませんでした");
            });
        }

        async function addPost() {
            const input = document.getElementById('urlInput'); const url = input.value.trim();
            if (!url) return;
            const data = JSON.parse(JSON.stringify(window.appState.appData));
            const board = data.boards.find(b => String(b.id) === String(data.activeBoardId)); if (!board) return showToast("ボード選択して");
            if (board.posts.some(p => p.url === url)) return showToast("追加済み");
            window.appState.searchQuery = ""; window.appState.selectedTags = [];
            const searchInput = document.getElementById('searchInput'); if (searchInput) searchInput.value = "";

            const youtubeId = parseYouTubeId(url);
            if (youtubeId) {
                board.posts.unshift({ type: 'youtube', url, id: Date.now().toString() + Math.random().toString(36).substr(2, 5), youtubeId, memo: "", tags: ["youtube"] });
                await window.saveData(data); input.value = ''; showToast("追加しました");
                return;
            }

            const tweetId = (url.match(/\/status\/(\d+)/) || [])[1];
            if (!tweetId) return showToast("URLが無効（X または YouTube のURLを入力してください）");
            board.posts.unshift({ type: 'tweet', url, id: Date.now().toString() + Math.random().toString(36).substr(2, 5), tweetId, memo: "", tags: ["x"] });
            await window.saveData(data); input.value = ''; showToast("追加しました");
        }

        async function addNoteCard() {
            const data = JSON.parse(JSON.stringify(window.appState.appData));
            const board = data.boards.find(b => String(b.id) === String(data.activeBoardId)); if (!board) return showToast("ボード選択して");
            window.appState.searchQuery = ""; window.appState.selectedTags = [];
            const searchInput = document.getElementById('searchInput'); if (searchInput) searchInput.value = "";
            const newNote = { type: 'note', id: Date.now().toString() + Math.random().toString(36).substr(2, 5), title: "", body: "", tags: [] };
            board.posts.unshift(newNote);
            await window.saveData(data);
            showToast("テキストカードを追加しました");
            setTimeout(() => {
                const titleEl = document.getElementById('note-title-' + newNote.id);
                if (titleEl) titleEl.focus();
            }, 150);
        }

        function removePost(id) {
            const board = window.appState.appData.boards.find(b => String(b.id) === String(window.appState.appData.activeBoardId));
            const post = board && board.posts.find(p => p.id === id);
            const msg = post && post.type === 'note' ? "このテキストカードを削除しますか？" : "このポストを削除しますか？";
            openConfirmModal(msg, async () => {
                const data = JSON.parse(JSON.stringify(window.appState.appData));
                const board = data.boards.find(b => String(b.id) === String(window.appState.appData.activeBoardId));
                if (board) { board.posts = board.posts.filter(p => p.id !== id); await window.saveData(data); showToast("削除しました"); }
            });
        }
        async function deleteBoard(id, e) {
            if(e) e.stopPropagation(); if (window.appState.appData.boards.length <= 1) return showToast("最低1つ必要");
            openConfirmModal("このボードを削除しますか？", async () => {
                const data = JSON.parse(JSON.stringify(window.appState.appData));
                data.boards = data.boards.filter(b => String(b.id) !== String(id));
                if (String(data.activeBoardId) === String(id)) data.activeBoardId = data.boards[0]?.id || null;
                await window.saveData(data);
            });
        }
        async function deleteFolder(id, e) {
            if(e) e.stopPropagation();
            openConfirmModal("このフォルダを削除しますか？", async () => {
                const data = JSON.parse(JSON.stringify(window.appState.appData));
                data.folders = data.folders.filter(f => String(f.id) !== String(id));
                data.boards.forEach(b => { if (String(b.folderId) === String(id)) b.folderId = null; });
                await window.saveData(data);
            });
        }
        function toggleFolder(id, e) { if(e) e.stopPropagation(); const d = JSON.parse(JSON.stringify(window.appState.appData)); const f = d.folders.find(f => String(f.id) === String(id)); if(f){f.expanded = !f.expanded; window.saveData(d);} }
        async function updatePostField(id, f, v) { const d = JSON.parse(JSON.stringify(window.appState.appData)); const board = d.boards.find(b => String(b.id) === String(d.activeBoardId)); const p = board?.posts.find(p => p.id === id); if (p) { p[f] = v; await window.saveData(d, true); } }
        async function addTag(id, t) {
            t = t.trim(); if (!t) return; const d = JSON.parse(JSON.stringify(window.appState.appData)); const board = d.boards.find(b => String(b.id) === String(d.activeBoardId)); const p = board?.posts.find(p => p.id === id);
            if (p) { if (!p.tags) p.tags = []; if (!p.tags.includes(t)) { p.tags.push(t); await window.saveData(d, true); renderTags(id, p.tags); updateSuggestedTags(id); if (window.appState.isFilterExpanded) updateFilterTagsUI(); } }
        }
        async function removeTag(id, t) {
            const d = JSON.parse(JSON.stringify(window.appState.appData)); const board = d.boards.find(b => String(b.id) === String(d.activeBoardId)); const p = board?.posts.find(p => p.id === id);
            if (p && p.tags) { p.tags = p.tags.filter(tg => tg !== t); await window.saveData(d, true); renderTags(id, p.tags); updateSuggestedTags(id); if (window.appState.isFilterExpanded) updateFilterTagsUI(); }
        }
        function renderTags(id, t) { const el = document.getElementById(`tags-display-${id}`); if (el) el.innerHTML = (t || []).map(tg => `<span class="tag-pill shadow-sm" style="${getTagStyle(tg)}">#${escapeHtml(tg)}<button type="button" class="tag-remove" onclick="removeTag(${escapeHtml(jsString(id))}, ${escapeHtml(jsString(tg))})" aria-label="${escapeHtml(tg)} タグを削除">×</button></span>`).join(''); }
        function updateSuggestedTags(id) {
            const el = document.getElementById(`tags-suggested-${id}`); if (!el) return; const board = window.appState.appData.boards.find(b => String(b.id) === String(window.appState.appData.activeBoardId)); if (!board) return; const p = board.posts.find(p => p.id === id); if (!p) return;
            const a = [...new Set(board.posts.flatMap(p => p.tags || []))].sort(); const s = a.filter(tg => !(p.tags || []).includes(tg));
            if (!s.length) { el.classList.add('hidden'); return; } el.classList.remove('hidden'); el.innerHTML = s.map(tg => `<button type="button" class="tag-suggest shadow-inner" style="${getTagStyle(tg)}" onclick="addTag(${escapeHtml(jsString(id))}, ${escapeHtml(jsString(tg))})">+ ${escapeHtml(tg)}</button>`).join('');
        }
        function updateFilterTagsUI() {
            const board = window.appState.appData.boards.find(b => String(b.id) === String(window.appState.appData.activeBoardId)); const el = document.getElementById('tagFilterList'); if (!board || !el) return;
            const a = [...new Set(board.posts.flatMap(p => p.tags || []))].sort(); if (!a.length) { el.innerHTML = `<span class="text-xs italic px-2" style="color:var(--text-muted)">タグがありません</span>`; return; }
            const selected = window.appState.selectedTags;
            el.innerHTML = a.map(t => {
                const isActive = selected.includes(t);
                const count = board.posts.filter(p => (p.tags||[]).includes(t)).length;
                return `<button onclick="selectTagFilter(${escapeHtml(jsString(t))})" class="tag-pill transition-all ${isActive ? 'shadow-lg brightness-110 ring-1 ring-indigo-500/50' : 'opacity-60 hover:opacity-100'}" style="${getTagStyle(t)}${isActive ? ';outline:1.5px solid rgba(124,111,255,0.5)' : ''}">${escapeHtml(t)}<span style="opacity:0.6;font-size:9px;margin-left:3px">${count}</span></button>`;
            }).join('');
            // 選択中タグがある場合はクリアボタンを追加
            if (selected.length > 0) {
                el.innerHTML += `<button onclick="clearTagFilters()" class="tag-pill transition-all opacity-70 hover:opacity-100" style="background:rgba(239,68,68,0.12);color:#fca5a5;border-color:rgba(239,68,68,0.25);margin-left:4px">✕ クリア</button>`;
            }
        }

        function buildCard(p) {
            if (!p.type) p.type = 'tweet'; // 旧データ後方互換
            const postIdArg = escapeHtml(jsString(p.id));
            const postIdHtml = escapeHtml(p.id);
            const youtubeIdHtml = escapeHtml(p.youtubeId || '');
            const youtubeIdArg = escapeHtml(jsString(p.youtubeId || ''));
            const tweetIdHtml = escapeHtml(p.tweetId || '');
            const card = document.createElement('div');
            card.className = 'bookmark-card group shadow-lg cursor-grab active:cursor-grabbing';
            card.setAttribute('data-id', p.id);
            card.setAttribute('draggable', 'true');
            card.ondragstart = (e) => handleDragStartPost(p.id, e);
            card.ondragend = handleDragEnd;
            card.ondragover = handleDragOver;
            card.ondragleave = (e) => { e.currentTarget.classList.remove('drag-over'); e.currentTarget.classList.remove('is-active'); };
            card.ondrop = (e) => handleDropPostOnPost(p.id, e);
            card.onmouseleave = () => card.classList.remove('is-active');
            card.onclick = (e) => {
                if (e.target.closest('button') || e.target.closest('textarea') || e.target.closest('input') || e.target.closest('a')) return;
                card.classList.toggle('is-active');
            };

            const tagSection = `
                <hr class="note-divider">
                <div class="note-card-tags-section">
                    <div id="tags-display-${postIdHtml}" class="flex flex-wrap gap-1.5"></div>
                    <div id="tags-suggested-${postIdHtml}" class="flex flex-wrap gap-1.5"></div>
                    <div class="tag-input-wrap"><span style="color:var(--text-muted)">${ICONS.tag}</span><input type="text" placeholder="Enterでタグ追加..." class="tag-text-input" onfocus="window.appState.isEditing = true" onblur="window.appState.isEditing = false" onkeydown="if(event.key === 'Enter' && !event.isComposing) { event.preventDefault(); addTag(${postIdArg}, this.value); this.value=''; }"></div>
                </div>`;

            if (p.type === 'note') {
                // ── テキストカード ──
                card.innerHTML = `
                    <div class="note-card-body">
                        <div class="flex justify-between items-start">
                            <span class="note-card-badge">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                Note
                            </span>
                            <button onclick="removePost(${postIdArg})" class="card-delete-btn flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all" style="padding:6px" aria-label="カードを削除">${ICONS.trash}</button>
                        </div>
                        <textarea id="note-title-${postIdHtml}" class="note-title-input" placeholder="タイトル..." rows="1"
                            onfocus="window.appState.isEditing = true"
                            onblur="window.appState.isEditing = false; updatePostField(${postIdArg},'title',this.value)"
                            oninput="autoResizeTextarea(this)"
                        >${escapeHtml(p.title || '')}</textarea>
                        <textarea id="note-body-${postIdHtml}" class="note-body-input" placeholder="本文を入力..."
                            onfocus="window.appState.isEditing = true"
                            onblur="window.appState.isEditing = false; updatePostField(${postIdArg},'body',this.value)"
                            oninput="autoResizeTextarea(this)"
                        >${escapeHtml(p.body || '')}</textarea>
                        ${tagSection}
                    </div>`;
            } else if (p.type === 'youtube') {
                // ── YouTubeカード ──
                card.innerHTML = `
                    <div id="youtube-media-${postIdHtml}" class="relative w-full youtube-wrapper overflow-hidden">
                        <div class="drop-shield" onclick="playYouTube(${postIdArg}, ${youtubeIdArg})"></div>
                        <div class="media-actions">
                            <button type="button" onclick="openYouTubeFullscreen(${postIdArg}, ${youtubeIdArg}, event)" class="media-action-btn" aria-label="全画面で再生">${ICONS.maximize}</button>
                            <button onclick="removePost(${postIdArg})" class="card-delete-btn flex items-center justify-center" aria-label="カードを削除">${ICONS.trash}</button>
                        </div>
                        <button type="button" class="youtube-thumb-wrap block" onclick="playYouTube(${postIdArg}, ${youtubeIdArg})" aria-label="埋め込みでYouTubeを再生">
                            <img
                                src="https://i.ytimg.com/vi/${youtubeIdHtml}/hqdefault.jpg"
                                alt="YouTube thumbnail"
                                onerror="this.src='https://i.ytimg.com/vi/${youtubeIdHtml}/mqdefault.jpg'"
                            >
                            <span class="youtube-play-badge" aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                            </span>

                        </button>
                    </div>
                    <div class="card-info-panel"><div class="card-info-inner"><div class="flex flex-col gap-4">
                        <div class="flex justify-between items-center px-1">
                            <label class="field-label">Memo</label>
                            <a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer" class="text-[10px] flex items-center gap-1 font-bold" style="color:#f87171" onmouseover="this.style.color='#fca5a5'" onmouseout="this.style.color='#f87171'">
                                YouTubeで見る ${ICONS.external}
                            </a>
                        </div>
                        <textarea placeholder="メモ..." class="memo-textarea" onfocus="window.appState.isEditing = true" onblur="window.appState.isEditing = false; updatePostField(${postIdArg},'memo',this.value)">${escapeHtml(p.memo || "")}</textarea>
                        <div><label class="field-label">Tags</label>
                            <div id="tags-display-${postIdHtml}" class="flex flex-wrap gap-1.5 mb-2.5"></div>
                            <div id="tags-suggested-${postIdHtml}" class="flex flex-wrap gap-1.5 mb-3"></div>
                            <div class="tag-input-wrap"><span style="color:var(--text-muted)">${ICONS.tag}</span><input type="text" placeholder="Enterでタグ追加..." class="tag-text-input" onfocus="window.appState.isEditing = true" onblur="window.appState.isEditing = false" onkeydown="if(event.key === 'Enter' && !event.isComposing) { event.preventDefault(); addTag(${postIdArg}, this.value); this.value=''; }"></div>
                        </div>
                    </div></div></div>`;
            } else {
                // ── Tweetカード ──
                card.innerHTML = `
                    <div class="relative w-full min-h-[100px] tweet-wrapper overflow-hidden">
                        <div class="drop-shield"></div>
                        <div class="absolute top-3 right-3 z-50 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                            <button onclick="removePost(${postIdArg})" class="card-delete-btn flex items-center justify-center" aria-label="カードを削除">${ICONS.trash}</button>
                        </div>
                        <div class="p-1" id="tweet-${postIdHtml}"><div class="skeleton-placeholder m-2"></div></div>
                    </div>
                    <div class="card-info-panel"><div class="card-info-inner"><div class="flex flex-col gap-4">
                        <div class="flex justify-between items-center px-1">
                            <label class="field-label">Memo</label>
                            <a href="https://x.com/i/status/${tweetIdHtml}" target="_blank" rel="noopener noreferrer" class="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold">
                                Xで見る ${ICONS.external}
                            </a>
                        </div>
                        <textarea placeholder="メモ..." class="memo-textarea" onfocus="window.appState.isEditing = true" onblur="window.appState.isEditing = false; updatePostField(${postIdArg},'memo',this.value)">${escapeHtml(p.memo || "")}</textarea>
                        <div><label class="field-label">Tags</label>
                            <div id="tags-display-${postIdHtml}" class="flex flex-wrap gap-1.5 mb-2.5"></div>
                            <div id="tags-suggested-${postIdHtml}" class="flex flex-wrap gap-1.5 mb-3"></div>
                            <div class="tag-input-wrap"><span style="color:var(--text-muted)">${ICONS.tag}</span><input type="text" placeholder="Enterでタグ追加..." class="tag-text-input" onfocus="window.appState.isEditing = true" onblur="window.appState.isEditing = false" onkeydown="if(event.key === 'Enter' && !event.isComposing) { event.preventDefault(); addTag(${postIdArg}, this.value); this.value=''; }"></div>
                        </div>
                    </div></div></div>`;
            }
            return card;
        }

        function autoResizeTextarea(el) {
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        }

        function getColumnCount() {
            const w = document.getElementById('gallery').offsetWidth;
            if (w >= 1500) return 4;
            if (w >= 1150) return 3;
            if (w >= 680)  return 2;
            return 1;
        }

        function renderActiveBoard() {
            const board = window.appState.appData.boards.find(b => String(b.id) === String(window.appState.appData.activeBoardId));
            const container = document.getElementById('gallery'); if (!container) return; if (!board) { document.getElementById('activeBoardTitle').textContent = "ボードを選択してください"; container.innerHTML = ''; return; }
            document.getElementById('activeBoardTitle').textContent = board.name;
            let posts = board.posts;
            if (window.appState.searchQuery) posts = posts.filter(p =>
                (p.memo||"").toLowerCase().includes(window.appState.searchQuery) ||
                (p.title||"").toLowerCase().includes(window.appState.searchQuery) ||
                (p.body||"").toLowerCase().includes(window.appState.searchQuery)
            );
            if (window.appState.selectedTags.length) posts = posts.filter(p => window.appState.selectedTags.every(t => (p.tags||[]).includes(t)));
            if (window.appState.isFilterExpanded) updateFilterTagsUI();

            // カードIDリストが変わった時だけ再描画
            const allCardIds = Array.from(container.querySelectorAll('.bookmark-card')).map(c => c.getAttribute('data-id'));
            const newIds = posts.map(p => p.id);
            if (JSON.stringify(allCardIds) !== JSON.stringify(newIds)) {
                container.innerHTML = '';
                if (!posts.length) {
                    document.getElementById('emptyState').classList.remove('hidden');
                    return;
                }
                document.getElementById('emptyState').classList.add('hidden');

                const colCount = getColumnCount();
                const cols = Array.from({ length: colCount }, () => {
                    const col = document.createElement('div');
                    col.className = 'board-col';
                    container.appendChild(col);
                    return col;
                });

                posts.forEach((p, i) => {
                    const card = buildCard(p);
                    cols[i % colCount].appendChild(card);
                    renderTags(p.id, p.tags);
                    updateSuggestedTags(p.id);
                    if (p.type === 'note') {
                        setTimeout(() => {
                            const t = document.getElementById('note-title-' + p.id);
                            const b = document.getElementById('note-body-' + p.id);
                            if (t) autoResizeTextarea(t);
                            if (b) autoResizeTextarea(b);
                        }, 0);
                    } else if (p.type === 'tweet') {
                        const tc = document.getElementById('tweet-' + p.id);
                        const check = setInterval(() => { if (window.twttr && window.twttr.widgets) { clearInterval(check); window.twttr.widgets.createTweet(p.tweetId, tc, { theme: 'dark', lang: 'ja', dnt: true, conversation: 'none', cards: 'visible', width: 'auto' }).then(() => { const s = tc.querySelector('.skeleton-placeholder'); if (s) s.remove(); }); } }, 100); setTimeout(() => clearInterval(check), 8000);
                    }
                });
            }
        }

        // ウィンドウリサイズ時に列数が変わったら再描画
        let _lastColCount = 0;
        let _resizeTimer = null;
        window.addEventListener('resize', () => {
            clearTimeout(_resizeTimer);
            _resizeTimer = setTimeout(() => {
                const gallery = document.getElementById('gallery');
                if (!gallery) return;
                const newCount = getColumnCount();
                if (newCount !== _lastColCount) {
                    _lastColCount = newCount;
                    gallery.innerHTML = '';
                    renderActiveBoard();
                }
            }, 120);
        });

        window.exportData = () => { const d = JSON.stringify(window.appState.appData, null, 2); const u = 'data:application/json;charset=utf-8,'+ encodeURIComponent(d); const l = document.createElement('a'); l.setAttribute('href', u); l.setAttribute('download', 'backup.json'); l.click(); showToast('出力完了'); };
        window.importData = () => document.getElementById('importFile').click();
        
        document.getElementById('importFile').addEventListener('change', e => {
            const f = e.target.files[0]; if (!f) return;
            const r = new FileReader();
            r.onload = async ev => {
                try {
                    const d = JSON.parse(ev.target.result);
                    const data = JSON.parse(JSON.stringify(window.appState.appData));
                    if (d.type === 'single_board') {
                        const fileName = f.name.replace(/\.[^/.]+$/, "");
                        const newBoard = { ...d.data, id: Date.now().toString(), folderId: null, name: fileName };
                        data.boards.push(newBoard);
                        data.activeBoardId = newBoard.id;
                        await window.saveData(data);
                        showToast('ボードを取り込みました');
                    } else if (d.boards) {
                        await window.saveData(window.normalizeAppData ? window.normalizeAppData(d) : d);
                        showToast('データを復元しました');
                    } else { showToast('無効な形式'); }
                } catch (err) { showToast('エラーが発生しました'); }
            };
            r.readAsText(f);
        });

        window.toggleSidebar = toggleSidebar; window.toggleSearch = toggleSearch; window.toggleFilter = toggleFilter; window.openNewBoardModal = openNewBoardModal; window.openNewFolderModal = openNewFolderModal; window.closeModal = closeModal; window.confirmCreateBoard = confirmCreateBoard; window.confirmCreateFolder = confirmCreateFolder; window.deleteBoard = deleteBoard; window.deleteFolder = deleteFolder; window.addPost = addPost; window.removePost = removePost; window.updatePostField = updatePostField; window.handleSearch = handleSearch; window.selectTagFilter = selectTagFilter; window.handleSearchMouseLeave = handleSearchMouseLeave; window.addTag = addTag; window.removeTag = removeTag; window.openHelpModal = openHelpModal; window.openRenameModal = openRenameModal; window.selectBoard = selectBoard; window.toggleFolder = toggleFolder; window.openExportBoardModal = openExportBoardModal; window.confirmExportBoard = confirmExportBoard; window.addNoteCard = addNoteCard; window.autoResizeTextarea = autoResizeTextarea; window.clearTagFilters = clearTagFilters;
        window.playYouTube = playYouTube;
        window.openYouTubeFullscreen = openYouTubeFullscreen;

        document.getElementById('urlInput').addEventListener('keydown', (e) => e.key === 'Enter' && addPost());
        document.getElementById('newBoardName').addEventListener('keydown', (e) => e.key === 'Enter' && confirmCreateBoard());
        document.getElementById('newFolderName').addEventListener('keydown', (e) => e.key === 'Enter' && confirmCreateFolder());
