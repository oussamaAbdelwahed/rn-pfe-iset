import {
    THRESHOLD_PERCENTAGE_NBR_PAGE_VIEWS,
    THRESHOLD_NBR_SALES
} from '../CONSTANTS';


const getNewAudiencePercentageForPageViews = (initialNbr,nextNbr,roundRate=2) => {
    const diff = nextNbr - initialNbr;
    return ((diff / initialNbr) * 100).toFixed(roundRate);
};



const mustShowPageViewsVisualEffect = (initialNbr,nextNbr,roundRate=2) => {
    const res = getNewAudiencePercentageForPageViews(initialNbr,nextNbr,roundRate);
    if(res > THRESHOLD_PERCENTAGE_NBR_PAGE_VIEWS) {
        return {status:"winner"};
    }else if(res < (-THRESHOLD_PERCENTAGE_NBR_PAGE_VIEWS)){
        return {status:"looser"};
    }else {
        return false;
    }
};

const mustShowNbrSalesVisualEffect = (initialNbr,nextNbr) => {
   return (nextNbr - initialNbr) > THRESHOLD_NBR_SALES;
};


export {mustShowPageViewsVisualEffect,mustShowNbrSalesVisualEffect};