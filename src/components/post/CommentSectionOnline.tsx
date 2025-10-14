"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, RefreshCw, Send, AlertCircle, Reply, X } from 'lucide-react';
import { getComments, createComment, subscribeToComments, Comment } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

interface CommentSectionProps {
  postId: string;
}

// 과학자/발명가 버전
const scientistNames = [
  "호기심많은뉴턴", "창의적인에디슨", "열정적인퀴리", "도전적인아인슈타인", "혁신적인테슬라",
  "탐구하는다윈", "발견하는갈릴레이", "실험하는파스퇴르", "계산하는튜링", "관찰하는허블",
  "분석하는멘델레예프", "연구하는파인만", "설계하는라이트", "발명하는벨", "추론하는홈즈",
  "질문하는소크라테스", "증명하는유클리드", "통찰하는프로이트", "코딩하는에이다", "탐험하는콜럼버스",
  "도전하는마젤란", "기록하는다빈치", "측정하는코페르니쿠스", "관측하는케플러", "수학의가우스",
  "논리의러셀", "원자의러더퍼드", "백신의제너", "해독하는로살린드", "프로그래밍의그레이스"
];

// 우주/천체 버전
const spaceNames = [
  "빛나는시리우스", "신비로운안드로메다", "영원한북극성", "아름다운오리온", "강렬한베텔게우스",
  "우아한카시오페아", "거대한목성", "고리의토성", "붉은화성", "빠른수성",
  "반짝이는금성", "푸른해왕성", "차가운명왕성", "회전하는펄서", "깊은블랙홀",
  "화려한초신성", "나선은하수", "밝은퀘이사", "신비한성운", "영원한혜성",
  "타오르는태양", "고요한달", "떠도는소행성", "꼬리긴유성", "찬란한북두칠성",
  "무한한우주", "반짝이는별똥별", "아름다운은하", "신비한암흑물질", "경이로운오로라"
];

// 판타지 캐릭터 버전
const fantasyNames = [
  "용감한기사", "지혜로운마법사", "민첩한레인저", "강력한전사", "신비한엘프",
  "든든한드워프", "교활한도적", "치유의사제", "예언자현자", "불꽃의소환사",
  "얼음의마도사", "바람의궁수", "대지의수호자", "빛의성기사", "그림자암살자",
  "룬의각인사", "별의점성술사", "시간의여행자", "꿈의방랑자", "운명의예언가",
  "번개의마검사", "자연의드루이드", "영혼의네크로맨서", "철의팔라딘", "폭풍의샤먼",
  "비전의아크메이지", "칼날의무희", "신성한템플러", "어둠의워록", "차원의마도사"
];

// 음식/디저트 버전 (새로운 테마)
const foodNames = [
  "달콤한마카롱", "부드러운티라미수", "바삭한크로플", "쫄깃한떡볶이", "시원한빙수",
  "고소한붕어빵", "달달한호떡", "매콤한김치", "향긋한커피", "상큼한레몬",
  "진한초콜릿", "부드러운푸딩", "바삭한쿠키", "폭신한케이크", "시원한아이스크림",
  "따뜻한라떼", "새콤한요거트", "고소한치즈", "달콤한꿀", "상큼한민트",
  "매운떡볶이", "시원한콜라", "뜨거운피자", "쫄깃한젤리", "바삭한감자칩",
  "부드러운수플레", "진한에스프레소", "달달한캐러멜", "향긋한바닐라", "톡쏘는사이다"
];

// 자연/날씨 버전 (새로운 테마)
const natureNames = [
  "잔잔한호수", "높은산봉우리", "깊은계곡", "넓은초원", "울창한숲",
  "맑은시냇물", "거친바다", "하얀구름", "따뜻한햇살", "시원한바람",
  "촉촉한이슬", "포근한봄날", "뜨거운여름", "선선한가을", "차가운겨울",
  "부드러운미풍", "강한태풍", "하얀눈꽃", "붉은단풍", "푸른하늘",
  "황금들판", "검은폭풍", "은빛달빛", "주황노을", "보라새벽",
  "투명한물방울", "무지개다리", "반짝이는서리", "따스한모닥불", "시원한그늘"
];

// 감정/성격 버전 (새로운 테마)
const personalityNames = [
  "명랑한낙천가", "차분한사색가", "열정적인몽상가", "섬세한예술가", "대담한모험가",
  "신중한전략가", "유쾌한익살꾼", "따뜻한위로자", "냉철한분석가", "자유로운영혼",
  "솔직한직설가", "부드러운중재자", "활발한분위기메이커", "진지한철학자", "장난스런개구쟁이",
  "다정한친구", "용감한도전자", "현명한조언자", "순수한낭만파", "든든한지원군",
  "재치있는입담꾼", "꼼꼼한완벽주의자", "느긋한여유파", "적극적인행동파", "조용한관찰자",
  "밝은에너자이저", "깊은사고뭉치", "빠른순발력왕", "끈질긴노력파", "창의적인아이디어뱅크"
];

// 영어 닉네임 배열들
const scientistNamesEn = [
  "CuriousNewton", "CreativeEdison", "PassionateCurie", "BoldEinstein", "InnovativeTesla",
  "ExploringDarwin", "DiscoveringGalileo", "ExperimentingPasteur", "CalculatingTuring", "ObservingHubble",
  "AnalyzingMendeleev", "ResearchingFeynman", "DesigningWright", "InventingBell", "DeducingHolmes",
  "QuestioningSocrates", "ProvingEuclid", "InsightfulFreud", "CodingAda", "ExploringColumbus",
  "ChallengingMagellan", "RecordingDaVinci", "MeasuringCopernicus", "ObservingKepler", "MathematicalGauss",
  "LogicalRussell", "AtomicRutherford", "VaccineJenner", "DecodingRosalind", "ProgrammingGrace"
];

const spaceNamesEn = [
  "BrightSirius", "MysteriousAndromeda", "EternalPolaris", "BeautifulOrion", "IntenseBetelgeuse",
  "ElegantCassiopeia", "MightyJupiter", "RingedSaturn", "RedMars", "SwiftMercury",
  "TwinklingVenus", "BlueNeptune", "ColdPluto", "SpinningPulsar", "DeepBlackHole",
  "SpectacularSupernova", "SpiralMilkyWay", "BrightQuasar", "MysticalNebula", "EternalComet",
  "BlazingSun", "SereneMoon", "WanderingAsteroid", "LongTailedMeteor", "RadiantBigDipper",
  "InfiniteUniverse", "ShootingStar", "BeautifulGalaxy", "MysteriousDarkMatter", "AmazingAurora"
];

const fantasyNamesEn = [
  "BraveKnight", "WiseMage", "AgilRanger", "MightyWarrior", "MysticalElf",
  "SturdyDwarf", "CunningRogue", "HealingPriest", "ProphetSage", "FlameSummoner",
  "FrostMage", "WindArcher", "EarthGuardian", "LightPaladin", "ShadowAssassin",
  "RuneEngraver", "StarAstrologer", "TimeTraveler", "DreamWanderer", "FateSeer",
  "ThunderSwordsman", "NatureDruid", "SoulNecromancer", "IronPaladin", "StormShaman",
  "ArcaneArchmage", "BladeDancer", "HolyTemplar", "DarkWarlock", "DimensionalMage"
];

const foodNamesEn = [
  "SweetMacaron", "SmoothTiramisu", "CrispyCroffle", "ChewyTteokbokki", "CoolBingsu",
  "NuttyBungeoppang", "SweetHotteok", "SpicyKimchi", "AromaticCoffee", "FreshLemon",
  "RichChocolate", "SmoothPudding", "CrispyCookie", "FluffyCake", "CoolIceCream",
  "WarmLatte", "TangyYogurt", "SavoryCheese", "SweetHoney", "FreshMint",
  "SpicyTteokbokki", "CoolCola", "HotPizza", "ChewyJelly", "CrispyChips",
  "SoftSouffle", "StrongEspresso", "SweetCaramel", "AromaticVanilla", "FizzySoda"
];

const natureNamesEn = [
  "CalmLake", "HighPeak", "DeepValley", "WideGrassland", "DenseForest",
  "ClearStream", "RoughSea", "WhiteCloud", "WarmSunshine", "CoolBreeze",
  "FreshDew", "CozySpringDay", "HotSummer", "CrispAutumn", "ColdWinter",
  "GentleWind", "StrongTyphoon", "WhiteSnowflake", "RedMapleLeaf", "BlueSky",
  "GoldenField", "BlackStorm", "SilverMoonlight", "OrangeSunset", "PurpleDawn",
  "ClearWaterdrop", "RainbowBridge", "SparklingFrost", "WarmBonfire", "CoolShade"
];

const personalityNamesEn = [
  "CheerfulOptimist", "CalmThinker", "PassionateDreamer", "DetailedArtist", "BoldAdventurer",
  "CarefulStrategist", "JoyfulJoker", "WarmComforter", "CoolAnalyst", "FreeSoul",
  "HonestSpeaker", "GentleMediator", "LivelyEnergizer", "SeriousPhilosopher", "PlayfulTrickster",
  "KindFriend", "BraveChallenger", "WiseAdvisor", "PureRomantic", "ReliableSupporter",
  "WittySpeaker", "MeticulousPerfectionist", "RelaxedChill", "ActiveGoGetter", "QuietObserver",
  "BrightEnergizer", "DeepThinker", "QuickWit", "PersistentWorker", "CreativeIdeaMaker"
];

// 테마 배열 (6개 테마, 총 180개 닉네임)
const themesKo = [scientistNames, spaceNames, fantasyNames, foodNames, natureNames, personalityNames];
const themesEn = [scientistNamesEn, spaceNamesEn, fantasyNamesEn, foodNamesEn, natureNamesEn, personalityNamesEn];

const avatarColors = [
  "bg-gradient-to-br from-purple-400 to-purple-600",
  "bg-gradient-to-br from-blue-400 to-blue-600",
  "bg-gradient-to-br from-green-400 to-green-600",
  "bg-gradient-to-br from-orange-400 to-orange-600",
  "bg-gradient-to-br from-pink-400 to-pink-600",
  "bg-gradient-to-br from-indigo-400 to-indigo-600",
  "bg-gradient-to-br from-teal-400 to-teal-600",
  "bg-gradient-to-br from-red-400 to-red-600",
  "bg-gradient-to-br from-yellow-400 to-yellow-600",
  "bg-gradient-to-br from-cyan-400 to-cyan-600"
];

// 개별 댓글 컴포넌트
function CommentItem({
  comment,
  level = 0,
  onReply
}: {
  comment: Comment;
  level?: number;
  onReply: (parentId: number, parentNickname: string) => void;
}) {
  const { t, language } = useLanguage();

  const formatTime = (timestamp: string | undefined) => {
    if (!timestamp) return t('comments.justNow');

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('comments.justNow');
    if (minutes < 60) return `${minutes}${t('comments.minutesAgo')}`;
    if (hours < 24) return `${hours}${t('comments.hoursAgo')}`;
    if (days < 7) return `${days}${t('comments.daysAgo')}`;
    return date.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US');
  };

  return (
    <div className={level > 0 ? 'ml-12' : ''}>
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex gap-3">
          <div className={`w-10 h-10 ${comment.avatar} rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm`}>
            {comment.nickname.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-medium text-gray-900 text-sm">{comment.nickname}</span>
              {level > 0 && <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{t('comments.replyBadge')}</span>}
              <span className="text-xs text-gray-400">· {formatTime(comment.created_at)}</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words">{comment.content}</p>

            {/* 답글 버튼 */}
            {comment.id && (
              <button
                onClick={() => onReply(comment.id!, comment.nickname)}
                className="mt-2 text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
              >
                <Reply className="w-3 h-3" />
                {t('comments.replyTo')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 답글 렌더링 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              level={level + 1}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Supabase 연동 버전
export default function CommentSectionOnline({ postId }: CommentSectionProps) {
  const { t, language } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState("");
  const [avatarColor, setAvatarColor] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: number; nickname: string } | null>(null);

  useEffect(() => {
    generateRandomNickname();
    checkSupabaseAndLoadComments();

    // 실시간 구독 설정
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const subscription = subscribeToComments(postId, (payload) => {
        if (payload.eventType === 'INSERT') {
          // 새 댓글 추가 시 전체 새로고침 (계층 구조 유지를 위해)
          checkSupabaseAndLoadComments();
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  // 언어 변경 시 닉네임 다시 생성
  useEffect(() => {
    generateRandomNickname();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Supabase 연결 확인 및 댓글 로드
  const checkSupabaseAndLoadComments = async () => {
    const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    setIsSupabaseAvailable(hasSupabase);

    if (hasSupabase) {
      await loadSupabaseComments();
    } else {
      loadLocalComments();
    }
  };

  // Supabase에서 댓글 불러오기
  const loadSupabaseComments = async () => {
    try {
      setIsLoading(true);
      const data = await getComments(postId);
      setComments(data);
      setError(null);
    } catch (err) {
      console.error('Error loading comments:', err);
      setError(t('comments.errorLoading'));
      loadLocalComments();
    } finally {
      setIsLoading(false);
    }
  };

  // 로컬 스토리지 폴백 (계층 구조 지원)
  const loadLocalComments = () => {
    const storedComments = localStorage.getItem(`comments_${postId}`);
    if (storedComments) {
      const localComments = JSON.parse(storedComments);

      // 계층 구조로 변환
      const commentMap = new Map<number, Comment>();
      const rootComments: Comment[] = [];

      localComments.forEach((c: any) => {
        const comment: Comment = {
          id: c.id,
          post_id: c.postId || postId,
          parent_id: c.parent_id || null,
          nickname: c.nickname,
          avatar: c.avatar,
          content: c.content,
          created_at: c.timestamp || c.created_at,
          replies: []
        };
        commentMap.set(comment.id!, comment);
      });

      localComments.forEach((c: any) => {
        const comment = commentMap.get(c.id)!;
        if (!c.parent_id) {
          rootComments.push(comment);
        } else {
          const parent = commentMap.get(c.parent_id);
          if (parent) {
            parent.replies = parent.replies || [];
            parent.replies.push(comment);
          }
        }
      });

      setComments(rootComments);
    }
    setIsLoading(false);
  };

  // 랜덤 닉네임 생성
  const generateRandomNickname = () => {
    // 현재 언어에 따라 테마 선택
    const themes = language === 'ko' ? themesKo : themesEn;
    const currentTheme = themes[Math.floor(Math.random() * themes.length)];
    const randomName = currentTheme[Math.floor(Math.random() * currentTheme.length)];
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    setNickname(randomName);
    setAvatarColor(randomColor);
  };

  // 답글 시작
  const handleReply = (parentId: number, parentNickname: string) => {
    setReplyingTo({ id: parentId, nickname: parentNickname });
    // 텍스트 입력창으로 포커스
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  };

  // 답글 취소
  const cancelReply = () => {
    setReplyingTo(null);
    setCommentText("");
  };

  // 댓글 제출
  const handleSubmit = async () => {
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    setError(null);

    try {
      if (isSupabaseAvailable) {
        // Supabase에 저장
        const newComment = await createComment({
          post_id: postId,
          parent_id: replyingTo?.id || null,
          nickname: nickname,
          avatar: avatarColor,
          content: commentText
        });

        if (newComment) {
          // 전체 새로고침 (계층 구조 유지를 위해)
          await loadSupabaseComments();
        } else {
          throw new Error('Failed to post comment');
        }
      } else {
        // 로컬 스토리지에 저장
        const storedComments = localStorage.getItem(`comments_${postId}`);
        const existingComments = storedComments ? JSON.parse(storedComments) : [];

        const newComment = {
          id: Date.now(),
          postId: postId,
          parent_id: replyingTo?.id || null,
          nickname: nickname,
          avatar: avatarColor,
          content: commentText,
          timestamp: new Date().toISOString()
        };

        existingComments.push(newComment);
        localStorage.setItem(`comments_${postId}`, JSON.stringify(existingComments));

        // 로컬 댓글 다시 로드 (계층 구조 재구성)
        loadLocalComments();
      }

      // 초기화
      setCommentText("");
      setReplyingTo(null);
      generateRandomNickname();
    } catch (err) {
      console.error('Error posting comment:', err);
      setError(t('comments.errorPosting'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 전체 댓글 수 계산 (답글 포함)
  const getTotalCommentCount = (comments: Comment[]): number => {
    let count = 0;
    const countReplies = (comment: Comment) => {
      count++;
      if (comment.replies) {
        comment.replies.forEach(countReplies);
      }
    };
    comments.forEach(countReplies);
    return count;
  };

  return (
    <div className="w-full mx-auto mt-20 mb-10">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-700 text-base font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          {t('comments.title')} {getTotalCommentCount(comments)}
        </h3>
      </div>

      {/* 오류 메시지 */}
      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-yellow-700">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* 닉네임 입력 영역 */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${avatarColor} rounded-lg flex items-center justify-center text-white font-bold shadow-sm`}>
              {nickname.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">{t('comments.authorNickname')}</p>
              <p className="text-gray-800 font-medium">{nickname}</p>
            </div>
          </div>

          <button
            onClick={generateRandomNickname}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all"
            title={t('comments.changeName')}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t('comments.changeName')}
          </button>
        </div>
      </div>

      {/* 답글 표시 */}
      {replyingTo && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-700">
            <Reply className="w-4 h-4" />
            <span className="text-sm">
              {t('comments.replyingTo')} <strong>{replyingTo.nickname}</strong>
            </span>
          </div>
          <button
            onClick={cancelReply}
            className="text-blue-600 hover:text-blue-800 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 댓글 입력 영역 */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-400 transition-colors">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSubmit();
            }
          }}
          placeholder={replyingTo ? t('comments.placeholderReply') : t('comments.placeholder')}
          className="w-full px-4 py-3 resize-none focus:outline-none text-gray-700 placeholder-gray-400"
          rows={3}
        />
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {t('comments.warning')}
          </p>
          <button
            onClick={handleSubmit}
            disabled={!commentText.trim() || isSubmitting}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? t('comments.submitting') : (replyingTo ? t('comments.submitReply') : t('comments.submit'))}
          </button>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="mt-8 space-y-4">
        {isLoading ? (
          <div className="text-center py-10 text-gray-400">
            {t('comments.loading')}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            {t('comments.noComments')}
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
            />
          ))
        )}
      </div>

      {/* 모드 표시 */}
      {!isSupabaseAvailable && (
        <div className="mt-8 text-center text-xs text-gray-400">
          {t('comments.localMode')}
        </div>
      )}
    </div>
  );
}