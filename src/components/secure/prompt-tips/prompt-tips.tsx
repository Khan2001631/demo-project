import React from 'react';
import Card from "../../common/card/card";
import { useTranslation } from 'react-i18next';

interface PromptTipsProps {
    selectedPromptObject: string;
}

const PromptTips: React.FC<PromptTipsProps> = (props) => {
    const { t } = useTranslation();
    return (
        <Card id="dtd_tips" titleType={1} 
            title={t('card.tips.title')}  help={true} Feedback={true} 
            logo={true} share={true} helpTitle={t('card.tips.help.title')} 
            helpContent={t('card.tips.help.content')}
        >
            {props.selectedPromptObject === 'promptActorDefinition' && (
                <div>
                    <p>{t('prompt.actor_persona_description')}</p>
                </div>
            )}
            {props.selectedPromptObject === 'promptEnvContext' && (
                <div>
                    <p>{t('prompt.eContext_description')}</p>
                </div>
            )}
            {props.selectedPromptObject === 'promptChallengeDesc' && (
                <div>
                    <p>{t('prompt.echescription_description')}</p>
                </div>
            )}
            {props.selectedPromptObject === 'promptDataHandling' && (
                <div>
                    <p>{t('prompt.dhandling_description')}</p>
                </div>
            )}
            {props.selectedPromptObject === 'promptGptblueObj' && (
                <div>
                    <p>{t('prompt.gptblueObjective_description')}</p>
                </div>
            )}
            {props.selectedPromptObject === 'promptAudience' && (
                <div>
                    <p>{t('prompt.audience_description')}</p>
                </div>
            )}
            {props.selectedPromptObject === 'promptTask' && (
                <div>
                    <p>{t('prompt.task_details_descriptiom')}</p>
                </div>
            )}
            {props.selectedPromptObject === 'promptRQuery' && (
                <div>
                    <p>{t('prompt.iterative_task_description')}</p>
                </div>
            )}
            {props.selectedPromptObject === 'promptDAction' && (
                <div>
                    <p>{t('prompt.default_action_description')}</p>
                </div>
            )}
            {props.selectedPromptObject === 'promptWritingStyle' && (
                <div>
                    <p>{t('prompt.writingstyle_description')}</p>
                </div>
            )}
            {props.selectedPromptObject === 'promptTimeline' && (
                <div>
                    <p>{t('prompt.timeline_description')}</p>
                </div>
            )}
            {props.selectedPromptObject === 'promptOFormat' && (
                <div>
                    <p>{t('prompt.output_format_description')}</p>
                </div>
            )}
            {props.selectedPromptObject === 'promptReferences' && (
                <div>
                    <p>{t('prompt.references_description')}</p>
                </div>
            )}
            {props.selectedPromptObject === 'promptFunctionCall' && (
                <div>
                    <p>{t('tips.f_call.description')}</p>
                </div>
            )}
        </Card>
    )
}

export default PromptTips;