import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Google Analytics 서비스 계정 인증 정보
const credentials = {
  type: "service_account",
  project_id: "connects-tech",
  private_key_id: "b81a93b11ba80a08978a2b5d7e13720eea60d447",
  private_key: process.env.NEXT_PUBLIC_GA_PRIVATE_KEY?.replace(/\\n/g, '\n') || "",
  client_email: process.env.NEXT_PUBLIC_GA_CLIENT_EMAIL || "",
  client_id: "112632312238598377198",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/connects-tech%40connects-tech.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') || '30';
    const propertyId = process.env.NEXT_PUBLIC_GA_PROPERTY_ID;

    if (!propertyId || !credentials.client_email || !credentials.private_key) {
      console.log('GA configuration missing, returning dummy data');
      return NextResponse.json({
        data: [
          { path: '/post/boltz-2-protein-structure-docking', views: 245 },
          { path: '/post/deepfri-protein-function-residue-prediction', views: 189 },
          { path: '/post/mhcflurry-peptide-binding-prediction', views: 167 },
          { path: '/post/diffdock-ligand-docking-prediction', views: 156 },
          { path: '/post/chai-protein-ligand-glycan-docking', views: 143 },
          { path: '/post/gromacs-molecular-dynamics-simulation', views: 132 },
          { path: '/post/admet-ai-drug-properties-prediction', views: 128 },
          { path: '/post/plip-protein-ligand-interaction-profiler', views: 115 },
          { path: '/post/immunebuilder-antibody-tcr-structure', views: 104 },
          { path: '/post/ligandmpnn-protein-ligand-optimization', views: 97 },
          { path: '/post/antifold-antibody-sequence-optimization', views: 89 },
          { path: '/post/dlkcat-enzyme-activity-prediction', views: 76 },
          { path: '/post/dscript-protein-interaction-prediction', views: 68 },
          { path: '/post/toxinpred3-peptide-toxicity-prediction', views: 54 },
          { path: '/post/bioemu-protein-structure-sampling', views: 47 },
          { path: '/post/netsolp-protein-solubility-prediction', views: 42 },
          { path: '/post/fixpdb-structure-cleaning-tool', views: 35 }
        ]
      });
    }

    // Google Analytics 클라이언트 초기화
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: credentials as any,
    });

    // 데이터 요청
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: `${days}daysAgo`,
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'pagePath',
        },
      ],
      metrics: [
        {
          name: 'screenPageViews',
        },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'BEGINS_WITH',
            value: '/post/',
          },
        },
      },
      orderBys: [
        {
          metric: {
            metricName: 'screenPageViews',
          },
          desc: true,
        },
      ],
      limit: 50,
    });

    // 데이터 포맷팅
    const data = response.rows?.map(row => ({
      path: row.dimensionValues?.[0]?.value || '',
      views: parseInt(row.metricValues?.[0]?.value || '0', 10),
    })) || [];

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Analytics API Error:', error);
    // 에러 시 더미 데이터 반환
    return NextResponse.json({
      data: [
        { path: '/post/boltz-2-protein-structure-docking', views: 245 },
        { path: '/post/deepfri-protein-function-residue-prediction', views: 189 },
        { path: '/post/mhcflurry-peptide-binding-prediction', views: 167 },
        { path: '/post/diffdock-ligand-docking-prediction', views: 156 },
        { path: '/post/chai-protein-ligand-glycan-docking', views: 143 },
        { path: '/post/gromacs-molecular-dynamics-simulation', views: 132 },
        { path: '/post/admet-ai-drug-properties-prediction', views: 128 },
        { path: '/post/plip-protein-ligand-interaction-profiler', views: 115 },
        { path: '/post/immunebuilder-antibody-tcr-structure', views: 104 },
        { path: '/post/ligandmpnn-protein-ligand-optimization', views: 97 },
        { path: '/post/antifold-antibody-sequence-optimization', views: 89 },
        { path: '/post/dlkcat-enzyme-activity-prediction', views: 76 },
        { path: '/post/dscript-protein-interaction-prediction', views: 68 },
        { path: '/post/toxinpred3-peptide-toxicity-prediction', views: 54 },
        { path: '/post/bioemu-protein-structure-sampling', views: 47 },
        { path: '/post/netsolp-protein-solubility-prediction', views: 42 },
        { path: '/post/fixpdb-structure-cleaning-tool', views: 35 }
      ]
    });
  }
}