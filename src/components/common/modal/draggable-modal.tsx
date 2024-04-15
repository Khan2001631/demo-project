export const draggableBootstrapModal = (el: HTMLElement) => {
    el.addEventListener('show.bs.modal', function () {
        document.body.classList.add('draggable-modal-open')
    })
    el.addEventListener('hidden.bs.modal', function () {
        document.body.classList.remove('draggable-modal-open')
    })

    let object = el.querySelector('.modal-dialog') as HTMLElement;
    let initX: number, initY: number, firstX: number, firstY: number;
    const modalHeader = el.querySelector('.modal-header') as HTMLElement;

    modalHeader.addEventListener('mousedown', startMove, false);
    modalHeader.addEventListener('touchstart', startMove, false);

    function startMove(e: MouseEvent | TouchEvent) {
        e.preventDefault();
        initX = object.offsetLeft;
        initY = object.offsetTop;

        if ('touches' in e) {
            firstX = e.touches[0].pageX;
            firstY = e.touches[0].pageY;
        } else {
            firstX = e.pageX;
            firstY = e.pageY;
        }

        window.addEventListener('mousemove', dragIt, false);
        window.addEventListener('touchmove', dragIt, false);

        modalHeader.addEventListener('mouseup', function () {
            window.removeEventListener('mousemove', dragIt, false);
        }, false);
        modalHeader.addEventListener('touchend', function () {
            window.removeEventListener('touchmove', dragIt, false);
        }, false);
    }

    function dragIt(e: MouseEvent | TouchEvent) {
        object.classList.add('has-been-dragged');
        //console.log('dragging')

        let currentX: number, currentY: number;
        if ('touches' in e) {
            currentX = e.touches[0].pageX;
            currentY = e.touches[0].pageY;
        } else {
            currentX = e.pageX;
            currentY = e.pageY;
        }

        object.style.left = `${initX + currentX - firstX}px`;
        object.style.top = `${initY + currentY - firstY}px`;

        if (object.offsetLeft < 0) object.style.left = '0px';
        if (object.offsetTop < 0) object.style.top = '0px';
        if (object.offsetLeft + object.clientWidth > window.innerWidth) object.style.left = `${window.innerWidth - object.clientWidth}px`;
        if (object.offsetTop + object.clientHeight > window.innerHeight) object.style.top = `${window.innerHeight - object.clientHeight}px`;
    }
}