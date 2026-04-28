        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

        const isCloudEnv = typeof __firebase_config !== 'undefined';
        
        window.appState = {
            user: null,
            isCloud: isCloudEnv,
            searchQuery: "",
            selectedTags: [],  // 複数タグフィルター
            selectedPostIds: [],
            isSearchExpanded: false,
            isFilterExpanded: false, 
            isEditing: false, 
            draggedPostId: null,
            draggedBoardId: null,
            pendingAction: null, // 確認モーダル用の保留アクション
            exportingBoardId: null, // 書き出し用
            appData: {
                activeBoardId: null,
                boards: [],
                folders: []
            }
        };

        window.saveData = async (newData, silent = false) => {
            window.appState.appData = newData;
            if (window.appState.isCloud && window.appState.user) {
                const uid = window.appState.user.uid;
                const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
                const db = getFirestore();
                const docRef = doc(db, 'artifacts', appId, 'users', uid, 'settings', 'appData');
                try { await setDoc(docRef, newData); } catch (e) { console.error("Save failed", e); }
            } else {
                localStorage.setItem('x_board_local_data_v4', JSON.stringify(newData));
            }
            
            if (!silent) {
                renderSidebar();
                renderActiveBoard();
            }
        };

        const initApp = async () => {
            if (isCloudEnv) {
                const firebaseConfig = JSON.parse(__firebase_config);
                const app = initializeApp(firebaseConfig);
                const auth = getAuth(app);
                const db = getFirestore(app);
                const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

                try {
                    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                        await signInWithCustomToken(auth, __initial_auth_token);
                    } else { await signInAnonymously(auth); }
                } catch (e) { console.error(e); }

                onAuthStateChanged(auth, (user) => {
                    window.appState.user = user;
                    if (user) {
                        const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'appData');
                        onSnapshot(docRef, (docSnap) => {
                            if (docSnap.exists()) {
                                const data = docSnap.data();
                                if (!data.folders) data.folders = [];
                                window.appState.appData = data;
                                if (!window.appState.isEditing) {
                                    renderSidebar();
                                    renderActiveBoard();
                                }
                            } else {
                                const defaultId = Date.now().toString();
                                window.saveData({
                                    activeBoardId: defaultId,
                                    boards: [{ id: defaultId, name: 'デフォルト', posts: [], folderId: null }],
                                    folders: []
                                });
                            }
                        });
                    }
                });
            } else {
                const saved = localStorage.getItem('x_board_local_data_v4');
                if (saved) {
                    try {
                        const data = JSON.parse(saved);
                        if (!data.folders) data.folders = [];
                        window.appState.appData = data;
                    } catch (e) {
                        console.error("Failed to parse saved data", e);
                        localStorage.removeItem('x_board_local_data_v4');
                    }
                }

                if (!window.appState.appData.boards.length) {
                    const defaultId = Date.now().toString();
                    window.appState.appData = {
                        activeBoardId: defaultId,
                        boards: [{ id: defaultId, name: 'デフォルト', posts: [], folderId: null }],
                        folders: []
                    };
                }
                renderSidebar();
                renderActiveBoard();
            }
        };

        window.addEventListener('DOMContentLoaded', initApp);
