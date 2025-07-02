/**
 * 新旧両方のGitHub UIに対応し、タイトルとURLをコピーするボタンを追加します。
 */
const addCopyButton = () => {
  // 既にボタンが追加されている場合は何もしない
  if (document.querySelector('.my-custom-copy-button')) {
    return;
  }

  // 新旧UIのセレクタを定義
  const selectors = {
    // 新しいUI (Reactベース)
    newUI: {
      title: 'bdi[data-testid="issue-title"]',
      target: 'div[data-component="PH_Actions"]',
    },
    // 従来のUI
    oldUI: {
      title: '.js-issue-title',
      target: '.gh-header-actions',
    }
  };

  // まず新しいUIのセレクタで要素を探す
  let titleElement = document.querySelector(selectors.newUI.title);
  let targetElement = document.querySelector(selectors.newUI.target);
  let isNewUI = true;

  // 新しいUIで見つからなければ、従来のUIのセレクタで探す
  if (!titleElement || !targetElement) {
    titleElement = document.querySelector(selectors.oldUI.title);
    targetElement = document.querySelector(selectors.oldUI.target);
    isNewUI = false;
  }

  // どちらのUIの要素も見つからなければ、処理を終了
  if (!titleElement || !targetElement) {
    return;
  }

  // --- ボタンの作成と追加 ---
  const copyButton = document.createElement('button');
  copyButton.type = 'button';

  // UIに応じてボタンの見た目を調整
  if (isNewUI) {
    // 新UIでは、既存のボタンのクラス名を借用して馴染ませる
    copyButton.className = 'prc-Button-ButtonBase-c50BI my-custom-copy-button';
  } else {
    // 従来UI
    copyButton.className = 'btn btn-sm my-custom-copy-button';
  }
  copyButton.textContent = 'Copy Link';

  // ボタンクリック時の処理
  copyButton.addEventListener('click', (e) => {
    e.preventDefault();
    const title = titleElement.innerText.trim();
    const url = location.href;
    const textToCopy = `[${title}](${url})`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = 'Copy Link';
      }, 2000); // 2秒後に元に戻す
    }).catch(err => {
      console.error('コピーに失敗しました', err);
    });
  });

  // 新UIの場合は既存のボタン群の中に入れる
  if (isNewUI && targetElement.firstChild) {
     targetElement.firstChild.prepend(copyButton);
  } else {
     targetElement.prepend(copyButton);
  }
};


// ページの構造が変更されたときにボタン追加処理を試みる監視役（Observer）
// これにより、ページ遷移時にもボタンが再描画される
const observer = new MutationObserver(() => {
  // 意図しないタイミングでの大量実行を防ぐため、少し待ってから実行
  setTimeout(addCopyButton, 500);
});

// 監視を開始
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// 初回読み込み時にも一度実行
addCopyButton();