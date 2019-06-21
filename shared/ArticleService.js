import gql from "graphql-tag"
//import client from "../config/graphql-ws.config"

import {getGQLClient} from '../graphql-utilities/gql-utils';


class ArticleService {

    static getAllArticles = async (project,interval) => {
      const client = await getGQLClient();
      const query  = await client.query({
          query: gql`
            query ($project: String!,$interval: String!){
              getFullDashboardData (project: $project,interval: $interval){
                articles {
                  id
                  title
                  description
                  nbr_ventes
                  pages_views
                  published_at
                  image_thumb
                }
                nbrUsers
                nbrSessions
                nbrActiveSubscribers
              }
            }
          `,
          fetchPolicy: "no-cache",
          variables:{project,interval}
      })

      return query.data
    } 

    //getting data for single article view 
    static  getSingleArticleFreshData = async (project,articleId,projectIntervale) => {
          const client = await getGQLClient();
          const query  = await client.query({
            query: gql`
             query ($project: String!,$articleId: ID!,$projectIntervale: String!) {
                getSingleArticleData (project: $project,articleId: $articleId, projectIntervale: $projectIntervale) {
                  nbrPageViews
                  nbrUsers
                  nbrSessions
                  nbrActiveSubscribers
                  nbrSales
                  lineChartData {
                    doc_count
                    key_as_string
                  }
                  geoMapData
                }
              }
            `,
            fetchPolicy: "no-cache",
            variables:{project,articleId,projectIntervale}
        })
        return query.data.getSingleArticleData  
    }
}

export default ArticleService
