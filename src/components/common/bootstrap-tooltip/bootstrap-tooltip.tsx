import { useEffect } from 'react';
import Tooltip from 'bootstrap/js/dist/tooltip';

function useBootstrapTooltip() {
    useEffect(() => {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new Tooltip(tooltipTriggerEl)
        })
    }, []);
}

export default useBootstrapTooltip;