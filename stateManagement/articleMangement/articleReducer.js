const initArticleObject = {
    projectType: "",
    title: "",
    content: "",
    image_url: "",
    published_at:"",
    pages_views:0,
    nbr_sales:0
}


const ArticleReducer = (state=initArticleObject, action) => {
    switch(action.type) {
        case "UPDATE_ARTICLE_META":
            state = {
                projectType: action.value.projectType,
                title: action.value.title,
                content: action.value.content,
                published_at: action.value.published_at,
                image_url: action.value.image_url,
                pages_views: action.value.pages_views,
                nbr_sales: action.value.pages_views
            }
        break


        default:
        break
    }

    return state
}


export default ArticleReducer