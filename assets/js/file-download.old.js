function downloadFile(url, fileName) {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

document.addEventListener("DOMContentLoaded", function () {
    const downloadButton = document.querySelector('.hoa-filetree-download');
    if (!downloadButton) return;

    downloadButton.addEventListener('click', async () => {
        const files = document.querySelectorAll('.hoa-filetree-file');
        const tasks = [];

        files.forEach(file => {
            const checkbox = file.querySelector('input');
            if (checkbox && checkbox.checked) {
                const link = file.querySelector('.hoa-filetree-download-link');
                if (!link) {
                    console.error('下载链接不存在');
                    return;
                }

                const url = link.href;
                const fileName = decodeURIComponent(link.getAttribute('download') || url.split('/').pop());

                tasks.push(
                    fetch(url)
                        .then(response => response.blob())
                        .then(blob => {
                            const blobUrl = URL.createObjectURL(blob);
                            downloadFile(blobUrl, fileName);
                            setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
                        })
                        .catch(error => console.error(`下载失败: ${fileName}`, error))
                );
            }
        });

        await Promise.allSettled(tasks); // 等待所有下载任务完成
    });
});
