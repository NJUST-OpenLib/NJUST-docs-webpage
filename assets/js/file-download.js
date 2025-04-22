// 创建下载管理器 UI
function createDownloadManager() {
    let container = document.getElementById('download-manager');
    if (!container) {
        container = document.createElement('div');
        container.id = 'download-manager';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.width = '90%';
        container.style.maxWidth = '400px';
        container.style.background = 'rgba(0, 0, 0, 0.8)';
        container.style.color = 'white';
        container.style.padding = '10px';
        container.style.borderRadius = '8px';
        container.style.fontSize = '14px';
        container.style.zIndex = '1000';
        container.style.overflowY = 'auto';
        container.style.maxHeight = '50vh';
        document.body.appendChild(container);
    }
    return container;
}

// 移除下载管理器（如果没有下载项）
function removeDownloadManagerIfEmpty() {
    const container = document.getElementById('download-manager');
    if (container && container.children.length === 0) {
        container.remove();
    }
}

// 添加进度条
function addProgressBar(fileName) {
    const container = createDownloadManager();
    const progressWrapper = document.createElement('div');
    progressWrapper.classList.add('download-item');
    progressWrapper.style.marginBottom = '10px';

    const label = document.createElement('div');
    label.textContent = `正在下载: ${fileName}`;
    label.style.marginBottom = '5px';

    const progressBar = document.createElement('div');
    progressBar.style.width = '100%';
    progressBar.style.height = '6px';
    progressBar.style.background = '#444';
    progressBar.style.borderRadius = '3px';
    progressBar.style.overflow = 'hidden';

    const progress = document.createElement('div');
    progress.style.width = '0%';
    progress.style.height = '100%';
    progress.style.background = '#4caf50';
    progressBar.appendChild(progress);

    progressWrapper.appendChild(label);
    progressWrapper.appendChild(progressBar);
    container.appendChild(progressWrapper);

    return { label, progress, progressWrapper };
}

// 下载文件并显示进度
function downloadFile(url, fileName) {
    const { label, progress, progressWrapper } = addProgressBar(fileName);

    fetch(url)
        .then(response => {
            const reader = response.body.getReader();
            const contentLength = +response.headers.get('Content-Length') || 0;
            let receivedLength = 0;
            const chunks = [];

            function readChunk() {
                return reader.read().then(({ done, value }) => {
                    if (done) {
                        const blob = new Blob(chunks);
                        const blobUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = blobUrl;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000); // 释放资源

                        label.textContent = `下载完成: ${fileName}`;
                        progress.style.background = '#2196F3'; // 蓝色表示完成
                        progress.style.width = '100%';

                        setTimeout(() => {
                            progressWrapper.remove();
                            removeDownloadManagerIfEmpty(); // 检查是否所有下载都完成
                        }, 2000); // 2秒后移除进度条

                        return;
                    }

                    chunks.push(value);
                    receivedLength += value.length;
                    if (contentLength) {
                        const percent = (receivedLength / contentLength) * 100;
                        progress.style.width = percent + '%';
                    }

                    return readChunk();
                });
            }

            return readChunk();
        })
        .catch(error => {
            console.error(`下载失败: ${fileName}`, error);
            label.textContent = `下载失败: ${fileName}`;
            progress.style.background = 'red'; // 红色表示失败

            setTimeout(() => {
                progressWrapper.remove();
                removeDownloadManagerIfEmpty();
            }, 5000); // 5秒后移除失败任务
        });
}

document.addEventListener("DOMContentLoaded", function () {
    const downloadButton = document.querySelector('.hoa-filetree-download');
    if (!downloadButton) return;

    downloadButton.addEventListener('click', () => {
        const files = document.querySelectorAll('.hoa-filetree-file');
        let hasFiles = false;

        files.forEach(file => {
            const checkbox = file.querySelector('input');
            if (checkbox.checked) {
                hasFiles = true;
                const link = file.querySelector('.hoa-filetree-download-link');
                if (link) {
                    const fileName = decodeURIComponent(link.getAttribute('download') || link.href.split('/').pop());
                    downloadFile(link.href, fileName);
                }
            }
        });

        if (!hasFiles) {
            alert('请选择要下载的文件！');
        }
    });
});
