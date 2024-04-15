import React, { useState } from 'react';

interface CogWheelProps {
    color: string;
}

const CogWheelSvg: React.FC<CogWheelProps> = ({ color }) => {
    return (
        <svg id="Ebene_2" width="23.07" height="23.07" viewBox="0 0 23.07 23.07" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <defs>
                <style>
                    {`.cls-1{clip-path:url(#clippath);}.cls-2{stroke-width:0px;}.cls-2,.cls-3{fill:none;}.cls-3{stroke:${color};stroke-linecap:round;stroke-linejoin:round;stroke-width:.8px;}`}
                </style>
                <clipPath id="clippath">
                    <rect className="cls-2" width="23.07" height="23.07"/>
                </clipPath>
            </defs>
            <g id="Ebene_4">
                <g className="cls-1">
                    <path className="cls-3" d="M22.67,11.53c0-.49-.03-.98-.1-1.47-.81-.16-1.64-.26-2.45-.31-.38-.02-.67-.25-.77-.56,0,0,0-.01-.01-.03,0-.02-.01-.05-.03-.09-.02-.07-.06-.17-.09-.27-.03-.1-.08-.19-.1-.27-.03-.07-.05-.12-.05-.12-.05-.13-.11-.25-.17-.38-.06-.12-.13-.25-.19-.37-.08-.14-.1-.31-.08-.47.02-.16.1-.33.22-.47.28-.31.53-.62.79-.95.25-.32.5-.66.73-1.01-.3-.39-.63-.76-.97-1.11M19.41,3.66c-.35-.34-.72-.67-1.11-.97-.34.23-.68.48-1.01.73-.33.25-.64.51-.94.79-.14.12-.3.2-.47.22-.16.03-.33,0-.47-.08,0,0-.18-.09-.37-.19-.1-.04-.19-.09-.26-.12-.07-.03-.12-.05-.12-.05-.26-.1-.52-.2-.78-.28-.31-.09-.54-.39-.56-.77-.05-.81-.15-1.64-.31-2.45-.49-.07-.98-.09-1.47-.1M11.53,.4c-.49,0-.98.03-1.47.1-.16.81-.26,1.64-.31,2.45-.02.38-.25.67-.56.77,0,0-.01,0-.03.01-.02,0-.05.01-.09.03-.07.02-.17.06-.27.09-.1.03-.19.08-.27.1-.07.03-.12.05-.12.05-.13.05-.25.11-.38.17-.12.06-.25.13-.37.19-.14.08-.31.1-.47.08-.16-.02-.33-.1-.47-.22-.31-.28-.62-.53-.94-.79-.33-.25-.66-.5-1.01-.73-.39.3-.76.63-1.11.97M3.66,3.66c-.34.35-.67.72-.97,1.11.23.34.48.68.73,1.01.25.33.51.64.79.95.12.14.2.31.22.47.03.16,0,.33-.08.47,0,0-.09.19-.19.37-.04.1-.09.19-.12.26-.03.07-.05.12-.05.12-.1.26-.2.52-.28.78-.1.31-.39.54-.77.56-.81.05-1.64.15-2.45.31-.07.49-.09.98-.1,1.47M.4,11.53c0,.49.03.98.1,1.47.81.16,1.64.26,2.45.31.38.02.67.25.77.56,0,0,0,.01,0,.03,0,.02.01,.05.03,.09.03,.07.06,.17.09,.27.03,.1.07,.19.1,.27.03,.07.05,.12.05,.12.05,.13.11,.25.17,.38.06,.12.13,.25.19,.37.08,.14.1,.31.08,.47-.02,.16-.1,.33-.22,.47-.28,.31-.53,.62-.79,.95-.25,.32-.5,.66-.73,1.01.3,.39.63,.76.97,1.11M3.66,19.41c.35,.34.72,.67,1.11,.97.34-.23.68-.48,1.01-.73.33-.25.64-.51.94-.79.14-.12.3-.2.47-.22.16-.03.33,0,.47,.08l.37,.19c.1,.04.19,.09.26,.12.07,.03.12,.05.12,.05.26,.1.52,.2.78,.28.31,.09.54,.39.56,.77.05,.81.15,1.64.31,2.45.49,.07.98,.09,1.47,.1M11.53,22.67c.49,0,.98-.03,1.47-.1.16-.81.26-1.64.31-2.45.02-.38.25-.67.56-.77,0,0,.01,0,.03-.01.02,0,.05-.01.09-.03.07-.03.17-.06.27-.09.1-.03.19-.07.27-.1.07-.03.12-.05.12-.05.13-.05.25-.11.38-.17.12-.06.25-.13.37-.19.14-.08.31-.1.47-.08.16,.02.33,.1.47,.22.31,.28.62,.53.94,.79.33,.25,.67,.5,1.01,.73.39-.3.76-.63,1.11-.97M19.41,19.41c.34-.35.67-.72.97-1.11-.23-.34-.48-.68-.73-1.01-.25-.33-.51-.64-.79-.95-.12-.14-.2-.3-.22-.47-.03-.16,0-.33,.08-.47,0,0,.09-.18,.19-.37.04-.1,.09-.19,.12-.26.03-.07,.05-.12,.05-.12.1-.26,.2-.52,.28-.78,.1-.31.39-.54.77-.56.81-.05,1.64-.15,2.45-.31.07-.49,.09-.98,.1-1.47M17.39,11.53c0,3.24-2.62,5.86-5.86,5.86s-5.86-2.62-5.86-5.86,2.62-5.86,5.86-5.86,5.86,2.62,5.86,5.86Z"/>
                </g>
            </g>
        </svg>
    );
};

export default CogWheelSvg;