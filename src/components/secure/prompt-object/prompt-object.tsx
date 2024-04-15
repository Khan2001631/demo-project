import React, { useEffect, useState } from 'react';
import Card from '../../common/card/card';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import TooltipComponent from '../../common/bootstrap-component/tooltip-component';

interface PromptObject {
    childConstIterative: boolean;
    childConstFunctionCall: boolean;
    childConstPromptLevel: number;
    onPromptObjectClick: (id: string) => void;
}
type promptObjectListItem = {
    id: string;
    name: string;
    level: string;
};


const PromptObject: React.FC<PromptObject> = (props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const defaultPromptLevel = 0;
    const [localPromptLevel, setLocalPromptLevel] = useState(defaultPromptLevel);
    const levels = ['S', 'A', 'E'];

    useEffect(() => {
        setLocalPromptLevel(props.childConstPromptLevel);
    }, [props.childConstPromptLevel]);

    const promptObjectList: promptObjectListItem[] = [
        { id: 'promptActorDefinition', name: t('prompt.actor_persona'), level: 'S' },
        { id: 'promptEnvContext', name: t('prompt.environment_context'), level: 'S' },
        { id: 'promptChallengeDesc', name: t('prompt.elaborate_Challenge_description'), level: 'S' },
        { id: 'promptDataHandling', name: t('prompt.data_handling'), level: 'E' },
        { id: 'promptGptblueObj', name: t('text.objective'), level: 'A' },
        { id: 'promptAudience', name: t('prompt.audience'), level: 'A' },
        { id: 'promptTask', name: t('prompt.task'), level: 'S' },
        { id: 'promptRQuery', name: t('prompt.iterative_task'), level: 'E' },
        { id: 'promptDAction', name: t('prompt.default_action'), level: 'S' },
        { id: 'promptWritingStyle', name: t('prompt.writing_style'), level: 'A' },
        { id: 'promptTimeline', name: t('prompt.timeline_priorities'), level: 'E' },
        { id: 'promptOFormat', name: t('prompt.output_format'), level: 'A' },
        { id: 'promptReferences', name: t('prompt.references'), level: 'A' },
        { id: 'promptFunctionCall', name: t('prompt.function_call'), level: 'E' },
    ];

    
    return (
        <Card id="dtd_promptObjectList" 
            titleType={1} title={t('prompt.prompt_object_list.title')} help={true} Feedback={true} logo={true} 
            // cardHeightClass={'h-100'} 
            helpTitle={t('prompt.prompt_object_list.help.title')} helpContent={t('prompt.prompt_object_list.help.content')}
        >
            <div className="mb-1">
                <div className='fw-bold mb-4 cursor-pointer' onClick={() => {navigate('/app/prompts/create');}}>
                    <TooltipComponent title={t('links.back_to_prompts.tooltip')}>
                        {t('links.back_to_prompts.label')}
                    </TooltipComponent>
                </div>
                {promptObjectList
                .filter(listItem => levels.slice(0, localPromptLevel + 1).includes(listItem.level))
                .map((listItem) => {
                    const isIterativeDisabled = !props.childConstIterative && listItem.id === 'promptRQuery';
                    const isFunctionCallDisabled = !props.childConstFunctionCall && listItem.id === 'promptFunctionCall';
                    const isDisabled = isIterativeDisabled || isFunctionCallDisabled;
                    return(
                        <div className={`mb-2 cursor-pointer ${isDisabled ? 'disabled-item' : ''}`} 
                            key={listItem.id} 
                            onClick={() => !isDisabled && props.onPromptObjectClick(listItem.id)}
                        >
                            {listItem.name}
                            {/* {listItem.id === 'promptDAction' && <span className="text-danger">*</span>} */}
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

export default PromptObject;