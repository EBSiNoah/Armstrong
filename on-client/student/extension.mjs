// 이 파일은 학생이 같은 프로젝트에서 이어서 구현합니다.
// 제공 UI를 받은 것만으로 단계 완료를 인정하지 않습니다.
const AI_MESSAGES = Object.freeze({
  ON_AI_PROVISIONING_PENDING: '「계정 연결 확인」에서 현재 계정 연결을 다시 확인하고, 학생 앱 AI 이용 권한의 발급·연결 상태는 담당자에게 확인하세요.',
  ON_AI_AUTHORIZATION_CHANGED: 'AI 이용 권한 내용이 점검 도중 바뀌었습니다. 「계정 연결 확인」에서 현재 계정 연결을 다시 확인하고, 담당자에게 현재 권한을 확인하세요.',
  ON_AI_MODEL_LIST_EMPTY: '현재 앱 권한으로 쓸 수 있는 AI 모델이 없습니다. 담당자에게 모델 허용 설정을 확인하세요.',
  ON_AI_INVALID_INPUT: '설명에 필요한 사건 근거·규칙을 확인할 수 없습니다.',
  ON_AI_INVALID_OUTPUT: 'AI 설명의 근거·조치·응답 형식을 확인할 수 없습니다.',
  ON_AI_TRANSPORT_PENDING: '공통 AI 연결 모듈을 준비 중입니다. 담당자에게 확인하세요.',
  WB_CLCO_AUTH_REQUIRED: '앱 전용 인증에 실패했습니다. 「계정 연결 확인」에서 현재 계정 연결을 다시 확인하고, 계속되면 담당자에게 앱 전용 인증 상태를 문의하세요. Workbench 열쇠를 복사하지 마세요.',
  WB_CLCO_INVALID_TOKEN: '앱 전용 인증 정보를 확인할 수 없습니다. 「계정 연결 확인」에서 현재 계정 연결을 다시 확인하고, 계속되면 담당자에게 확인하세요. 열쇠를 화면에 입력하지 마세요.',
  WB_CLCO_ACCESS_BLOCKED: '「계정 연결 확인」에서 현재 계정 연결을 다시 확인한 뒤, 담당자에게 학생 앱 AI 이용 권한을 확인하세요.',
  WB_CLCO_COHORT_BUDGET_EXHAUSTED: '반의 AI 사용량이 소진됐습니다. 담당자에게 확인하세요.',
  WB_CLCO_RATE_LIMITED: 'AI 요청이 잠시 제한됐습니다. 잠시 후 직접 다시 요청하세요.',
  WB_CLCO_LIMIT_REACHED: 'AI 이용 한도에 도달했습니다. 담당자에게 확인하세요.',
  WB_CLCO_SESSION_CLOSED: '현재 AI 이용 시간이 아닙니다. 이용 시간을 확인하세요.',
  WB_CLCO_TIMEOUT: 'AI 응답 시간이 초과됐습니다. 필요하면 직접 다시 요청하세요.',
  REQUEST_TIMEOUT: '서버의 AI 응답 시간이 초과됐습니다. 필요하면 직접 다시 요청하세요.',
  ENGINE_TIMEOUT: '서버의 확인 시간이 초과됐습니다. 필요하면 직접 다시 요청하세요.',
  TIMEOUT: 'AI 응답 시간이 초과됐습니다. 필요하면 직접 다시 요청하세요.',
  WB_CLCO_CANCELLED: 'AI 요청을 취소했습니다. 이전 응답은 현재 결과가 아닙니다.',
  CANCELLED: 'AI 요청을 취소했습니다. 이전 응답은 현재 결과가 아닙니다.',
  REQUEST_CANCELLED: 'AI 요청을 취소했습니다. 이전 응답은 현재 결과가 아닙니다.',
  MODEL_NOT_CONFIGURED: '서버에 사용할 AI 모델이 설정되지 않았습니다. 담당자에게 확인하세요.',
  WB_CLCO_SERVER_UNAVAILABLE: 'AI 서버가 응답하지 않습니다. 잠시 뒤 직접 다시 요청하세요.',
  WB_CLCO_NETWORK_ERROR: 'AI 서버에 연결할 수 없습니다. 연결 상태를 확인하세요.',
  NETWORK_ERROR: 'AI 서버에 연결할 수 없습니다. 연결 상태를 확인하세요.',
  WB_CLCO_INVALID_RESPONSE: 'AI 서버 응답 형식을 확인할 수 없습니다. 담당자에게 확인하세요.',
  WB_CLCO_RESPONSE_TOO_LARGE: 'AI 서버 응답이 너무 큽니다. 담당자에게 확인하세요.',
  WB_CLCO_REDIRECT_BLOCKED: 'AI 서버 주소가 다른 곳으로 이동했습니다. 담당자에게 확인하세요.',
  WB_CLCO_REQUEST_FAILED: 'AI 요청을 처리하지 못했습니다. 담당자에게 확인하세요.',
  SUBJECT_SCOPE_UNVERIFIED: '현재 로그인과 사건·프로젝트의 연결을 확인할 수 없습니다.',
  AI_REQUEST_UNVERIFIED: 'AI 연결 또는 응답을 확인할 수 없습니다. 기존 기록을 확인하세요.',
});
const AI_SECRET = /(?:Bearer\s+\S+|sk-(?:proj-|ant-|svcacct-)?[A-Za-z0-9_-]{8,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|(?:api[_ -]?key|authorization|password|비밀번호|토큰)\s*[:=]\s*\S+)/i;
const safeAiText = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.length <= max
  && !AI_SECRET.test(value) && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value);
const safeAiId = value => typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9._:-]{0,79}$/.test(value) && !AI_SECRET.test(value);
const safeAiTime = value => typeof value === 'string'
  && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)
  && Number.isFinite(Date.parse(value));
const exactFields = (value, names) => value !== null && typeof value === 'object' && !Array.isArray(value)
  && Object.keys(value).length === names.length && names.every(name => Object.hasOwn(value, name));
function validExplanation(data, event) {
  // 제공 UI는 검증된 설명 객체를 resource.data에 직접 전달한다.
  const explanation = data;
  if (!exactFields(explanation, ['summary', 'evidenceIds', 'proposals', 'requiresHumanConfirmation', 'executed'])
    || !safeAiId(event && event.id) || !Array.isArray(event.evidence) || !Array.isArray(event.rules)
    || !Array.isArray(event.supportedActions)) return null;
  const evidenceIds = new Set(event.evidence.map(row => row && row.id));
  const references = refs => Array.isArray(refs) && refs.length > 0 && new Set(refs).size === refs.length
    && refs.every(ref => safeAiId(ref) && evidenceIds.has(ref));
  if (!safeAiText(explanation.summary, 1500) || !references(explanation.evidenceIds)
    || explanation.evidenceIds.length !== evidenceIds.size || !Array.isArray(explanation.proposals)
    || explanation.proposals.length > 3
    || !explanation.proposals.every(proposal => exactFields(proposal, ['action', 'evidenceIds', 'reason'])
      && safeAiId(proposal.action) && event.supportedActions.includes(proposal.action)
      && references(proposal.evidenceIds) && safeAiText(proposal.reason, 500))
    || explanation.requiresHumanConfirmation !== true || explanation.executed !== false) return null;
  return structuredClone(explanation);
}

export function createStudentView() {
  let eventFilters = { kind: 'all', appId: 'all', access: 'all' };
  let selectedEventId = null;
  let helpCopyStatus = '';

  return {
    renderIdentity(input = {}) {
      const root = document.createElement('div');
      root.className = 'student-identity';

      const safeText = (value, fallback = '확인 불가') =>
        typeof value === 'string' && value.trim() ? value : fallback;
      const addText = (parent, tag, value, className) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        node.textContent = value;
        parent.appendChild(node);
        return node;
      };
      const deviceLabels = {
        compliant: '보안 기준 준수',
        noncompliant: '보안 기준 미준수',
        unknown: '확인 불가',
      };
      const sessionLabels = {
        active: '활성',
        expired: '만료',
        revoked: '취소됨',
        unknown: '확인 불가',
      };
      const stateText = (labels, value) => {
        const original = safeText(value, 'unknown');
        return `${labels[original] || '확인 불가'}(${original})`;
      };
      const modeLabels = {
        connected: '연결됨(connected)',
        demo: '예제 데이터(demo) · 실제 연결 아님',
        disconnected: '연결 없음(disconnected)',
        unknown: '연결 상태 확인 불가(unknown)',
      };

      const renderResource = (name, resource, renderOk, allowOkData = true, blockedMessage = '') => {
        const section = document.createElement('section');
        section.className = 'student-identity-resource';
        addText(section, 'h3', name);

        const status = resource && typeof resource === 'object' ? resource.status : undefined;
        if (status === 'loading') {
          addText(section, 'p', `${name}: 불러오는 중`);
        } else if (status === 'error') {
          const message = safeText(resource.error && resource.error.message, '오류 내용을 확인할 수 없습니다.');
          addText(section, 'p', `${name}: 불러오지 못했습니다. 상태를 확인할 수 없습니다. ${message}`, 'student-error');
        } else if (status === 'ok') {
          if (allowOkData) renderOk(section, resource.data);
          else addText(section, 'p', blockedMessage || '현재 로그인 정보를 확인할 수 없어 이전 정보를 표시하지 않습니다.');
        } else {
          addText(section, 'p', `${name}: 상태를 확인할 수 없습니다.`);
        }

        const mode = resource && typeof resource === 'object' ? resource.mode : undefined;
        addText(section, 'p', modeLabels[mode] || modeLabels.unknown, 'student-mode');
        root.appendChild(section);
      };

      renderResource('로그인 정보', input.me, (section, data) => {
        if (!data || typeof data !== 'object') {
          addText(section, 'p', '로그인 응답 형식을 확인할 수 없습니다.');
          return;
        }
        const user = data.user && typeof data.user === 'object' ? data.user : {};
        const device = data.device && typeof data.device === 'object' ? data.device : {};
        const session = data.session && typeof data.session === 'object' ? data.session : {};
        addText(section, 'p', `사용자: ${safeText(user.label)} · ID: ${safeText(user.id)}`);
        addText(section, 'p', `현재 기기: ${safeText(device.label)} · ID: ${safeText(device.id)} · ${stateText(deviceLabels, device.status)}`);
        addText(section, 'p', `현재 세션: ID ${safeText(session.id)} · ${stateText(sessionLabels, session.status)}`);
      });

      const identityReady = input.me && input.me.status === 'ok';
      const identityUnavailableMessage = input.me && input.me.status === 'loading'
        ? '로그인 정보를 확인하는 동안 이전 기기·세션 정보를 표시하지 않습니다.'
        : '로그인 정보를 확인할 수 없어 이전 기기·세션 정보를 표시하지 않습니다.';

      renderResource('내 기기', input.devices, (section, data) => {
        if (!Array.isArray(data)) {
          addText(section, 'p', '기기 목록 응답 형식을 확인할 수 없습니다.');
          return;
        }
        if (data.length === 0) {
          addText(section, 'p', '등록된 기기가 없습니다.');
          return;
        }
        const list = document.createElement('ul');
        for (const device of data) {
          const item = document.createElement('li');
          const value = device && typeof device === 'object' ? device : {};
          item.textContent = `${safeText(value.label)} · ID: ${safeText(value.id)} · ${stateText(deviceLabels, value.status)}`;
          list.appendChild(item);
        }
        section.appendChild(list);
      }, identityReady, identityUnavailableMessage);

      renderResource('내 세션', input.sessions, (section, data) => {
        if (!Array.isArray(data)) {
          addText(section, 'p', '세션 목록 응답 형식을 확인할 수 없습니다.');
          return;
        }
        if (data.length === 0) {
          addText(section, 'p', '표시할 세션이 없습니다.');
          return;
        }
        const list = document.createElement('ul');
        for (const session of data) {
          const item = document.createElement('li');
          const value = session && typeof session === 'object' ? session : {};
          item.textContent = `ID: ${safeText(value.id)} · ${stateText(sessionLabels, value.status)}`;
          list.appendChild(item);
        }
        section.appendChild(list);
      }, identityReady, identityUnavailableMessage);

      return root;
    },
    renderDecision(input = {}) {
      const root = document.createElement('div');
      root.className = 'student-decision';

      const addText = (tag, value, className) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        node.textContent = value;
        root.appendChild(node);
        return node;
      };
      const data = input && input.data && typeof input.data === 'object' ? input.data : {};
      const selectedAppId = typeof input.appId === 'string' && input.appId.trim()
        ? input.appId
        : (typeof data.appId === 'string' && data.appId.trim() ? data.appId : '');
      if (selectedAppId) addText('p', `업무 앱 ID: ${selectedAppId}`, 'student-app-id');

      const modeLabels = {
        connected: '연결됨(connected)',
        demo: '예제 데이터(demo) · 실제 연결 아님',
        disconnected: '연결 없음(disconnected)',
        unknown: '연결 상태 확인 불가(unknown)',
      };
      const mode = input && typeof input.mode === 'string' ? input.mode : 'unknown';
      addText('p', modeLabels[mode] || modeLabels.unknown, 'student-mode');

      // 상태를 판정 데이터보다 먼저 처리해, 실패나 대기를 거부 판정으로 오해하지 않게 한다.
      const status = input && typeof input.status === 'string' ? input.status : 'unknown';
      if (status === 'idle') {
        addText('p', '접근 요청 전입니다. 업무 앱을 선택한 뒤 접근을 요청하세요.', 'student-idle');
        return root;
      }
      if (status === 'loading') {
        addText('p', '접근 판정 요청을 처리하는 중입니다.', 'student-loading');
        return root;
      }
      if (status === 'error') {
        const rawMessage = input.error && input.error.message;
        const message = typeof rawMessage === 'string' && rawMessage.trim()
          ? rawMessage
          : '오류 내용을 확인할 수 없습니다.';
        addText('p', '접근 요청에 실패했습니다. 요청 실패는 접근 거부 판정이 아닙니다.', 'student-error');
        addText('p', message, 'student-error-message');
        return root;
      }
      if (status !== 'ok') {
        addText('p', '접근 판정 상태를 확인할 수 없습니다.', 'student-unverified');
        return root;
      }

      if (!input.data || typeof input.data !== 'object' || Array.isArray(input.data)) {
        addText('p', '판정 응답을 확인할 수 없습니다.', 'student-unverified');
        addText('p', '판정 이유: 확인 불가', 'student-reason');
        addText('p', '판정 시각: 확인 불가', 'student-checked-at');
        return root;
      }

      const decisions = {
        allow: '접근 허용',
        deny: '접근 거부',
        challenge: '추가 인증 또는 확인 필요',
        unknown: '판정 확인 불가',
      };
      const decision = input.data.decision;
      const isKnownDecision = typeof decision === 'string' && Object.hasOwn(decisions, decision);
      const displayCode = isKnownDecision ? decision : 'unknown';
      const decisionLabel = decisions[displayCode];
      addText('p', `${decisionLabel}(${displayCode})`, 'student-decision-result');

      if (decision === 'allow') {
        addText('p', '정책상 접근 허용이며 실제 앱 접속 성공을 보장하지 않습니다.', 'student-decision-note');
      } else if (decision === 'challenge') {
        addText('p', '이 화면은 추가 인증이나 확인 절차를 대신 수행하지 않습니다.', 'student-decision-note');
      }

      const reason = typeof input.data.reason === 'string' && input.data.reason.trim()
        ? input.data.reason
        : '확인 불가';
      addText('p', `판정 이유: ${reason}`, 'student-reason');

      const checkedAt = input.data.checkedAt;
      const checkedAtLabel = typeof checkedAt === 'string' && Number.isFinite(Date.parse(checkedAt))
        ? `${new Date(checkedAt).toLocaleString('ko-KR')} (${checkedAt})`
        : '확인 불가';
      addText('p', `판정 시각: ${checkedAtLabel}`, 'student-checked-at');
      return root;
    },
    renderEvents(input = {}) {
      const root = document.createElement('div');
      root.className = 'student-events';
      const addText = (parent, tag, value, className) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        node.textContent = value;
        parent.appendChild(node);
        return node;
      };
      const showValue = (value, fallback = '확인 불가') =>
        typeof value === 'string' && value.trim() ? value : fallback;

      if (input.status === 'loading') {
        // 새 조회가 시작되면 이전 응답에서 선택한 상세는 더 이상 최신 정보로 취급하지 않는다.
        selectedEventId = null;
        addText(root, 'p', '보안 기록 조회 중입니다.', 'student-events-loading');
        return root;
      }
      if (input.status === 'error') {
        // 실패 상태에서는 이전 상세 선택도 폐기하고 이전 목록을 재사용하지 않는다.
        selectedEventId = null;
        const message = showValue(input.error && input.error.message, '오류 내용을 확인할 수 없습니다.');
        addText(root, 'p', `보안 기록 조회에 실패했습니다. ${message}`, 'student-events-error');
        addText(root, 'p', '화면 상단의 「다시 불러오기」를 눌러 재조회하세요.');
        return root;
      }
      if (input.status !== 'ok' || !Array.isArray(input.data)) {
        addText(root, 'p', '보안 기록 조회 상태를 확인할 수 없습니다.', 'student-events-unverified');
        return root;
      }

      addText(root, 'p', '현재 조회 범위는 본인의 최근 40건입니다. 모든 직원의 전체 이력이나 실시간 전체 위협 탐지가 아닙니다.', 'student-events-scope');

      // 서버가 준 배열·객체는 변경하지 않고, 복사본만 최신 시각순으로 정렬한다.
      const events = [...input.data].sort((left, right) => {
        const leftAt = Date.parse(left && left.at);
        const rightAt = Date.parse(right && right.at);
        return (Number.isFinite(rightAt) ? rightAt : -Infinity)
          - (Number.isFinite(leftAt) ? leftAt : -Infinity);
      });
      const valuesFor = (field) => [...new Set(events.map((event) => {
        if (field === 'access') return event && event.state && event.state.access;
        return event && event[field];
      }).filter((value) => typeof value === 'string' && value.length > 0))];
      const optionsByFilter = {
        kind: valuesFor('kind'),
        appId: valuesFor('appId'),
        access: valuesFor('access'),
      };
      for (const key of Object.keys(eventFilters)) {
        if (eventFilters[key] !== 'all' && !optionsByFilter[key].includes(eventFilters[key])) eventFilters[key] = 'all';
      }

      const filters = document.createElement('div');
      filters.className = 'student-event-filters';
      const makeFilter = (key, labelText, allText) => {
        const label = document.createElement('label');
        label.className = 'student-event-filter';
        addText(label, 'span', labelText);
        const select = document.createElement('select');
        select.name = key;
        select.dataset.studentEventFilter = key;
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = allText;
        select.appendChild(allOption);
        for (const value of optionsByFilter[key]) {
          const option = document.createElement('option');
          option.value = value;
          option.textContent = value;
          select.appendChild(option);
        }
        select.value = eventFilters[key];
        select.addEventListener('change', () => {
          eventFilters[key] = select.value;
          const next = this.renderEvents(input);
          root.replaceWith(next);
        });
        label.appendChild(select);
        filters.appendChild(label);
      };
      makeFilter('kind', '기록 종류', '전체 종류');
      makeFilter('appId', '업무 앱', '전체 앱');
      makeFilter('access', '접속 상태', '전체 상태');
      root.appendChild(filters);

      const visibleEvents = events.filter((event) =>
        (event.kind === eventFilters.kind || eventFilters.kind === 'all')
        && ((event.appId == null ? '' : event.appId) === eventFilters.appId || eventFilters.appId === 'all')
        && ((event.state && event.state.access) === eventFilters.access || eventFilters.access === 'all'));
      addText(root, 'p', `표시 건수: ${visibleEvents.length}건`, 'student-events-count');
      if (!visibleEvents.some((event) => event.id === selectedEventId)) selectedEventId = null;

      if (visibleEvents.length === 0) {
        addText(root, 'p', events.length === 0 ? '조회된 보안 기록이 없습니다.' : '필터 조건에 맞는 보안 기록이 없습니다.', 'student-events-empty');
      } else {
        const list = document.createElement('ul');
        list.className = 'student-event-list';
        for (const event of visibleEvents) {
          const item = document.createElement('li');
          item.className = 'student-event-row';
          item.setAttribute('data-student-event-id', showValue(event.id, ''));
          const heading = addText(item, 'h3', `기록 ${showValue(event.id)}`);
          heading.className = 'student-event-title';
          const at = typeof event.at === 'string' && Number.isFinite(Date.parse(event.at))
            ? `${new Date(event.at).toLocaleString('ko-KR')} (${event.at})`
            : showValue(event.at);
          addText(item, 'p', `시각: ${at}`, 'student-event-time');
          const kindLabel = event.kind === 'access' ? '접속 기록' : event.kind === 'xdr' ? 'XDR 경보' : '';
          addText(item, 'p', `종류(kind): ${showValue(event.kind)}${kindLabel ? ` · ${kindLabel}` : ''}`, 'student-event-kind');
          addText(item, 'p', `앱(appId): ${showValue(event.appId)}`, 'student-event-app');
          addText(item, 'p', `요약: ${showValue(event.summary)}`, 'student-event-summary');
          const detailButton = document.createElement('button');
          detailButton.type = 'button';
          detailButton.textContent = `${showValue(event.id)} 상세`;
          detailButton.addEventListener('click', () => {
            selectedEventId = event.id;
            root.replaceWith(this.renderEvents(input));
          });
          item.appendChild(detailButton);
          list.appendChild(item);
        }
        root.appendChild(list);
      }

      const selected = visibleEvents.find((event) => event.id === selectedEventId);
      if (selected) {
        const detail = document.createElement('section');
        detail.className = 'student-event-detail';
        detail.setAttribute('data-student-event-detail', showValue(selected.id, ''));
        addText(detail, 'h3', `${selected.id} 상세`);
        addText(detail, 'p', `앱(appId): ${showValue(selected.appId)}`, 'student-event-app');

        const addTextRows = (heading, rows, className, emptyText) => {
          const section = document.createElement('section');
          section.className = className;
          addText(section, 'h4', heading);
          if (!Array.isArray(rows) || rows.length === 0) {
            addText(section, 'p', emptyText);
          } else {
            const list = document.createElement('ul');
            for (const row of rows) {
              const item = document.createElement('li');
              const id = showValue(row && row.id);
              const text = showValue(row && row.text);
              item.textContent = `${id}: ${text}`;
              list.appendChild(item);
            }
            section.appendChild(list);
          }
          detail.appendChild(section);
        };
        addTextRows('근거 (evidence)', selected.evidence, 'student-event-evidence', '근거 데이터가 없습니다.');
        addTextRows('규칙 (rules)', selected.rules, 'student-event-rules', '규칙 데이터가 없습니다.');

        const state = selected.state && typeof selected.state === 'object' ? selected.state : {};
        const stateLabels = {
          access: { allowed: '허용됨', denied: '거부됨', unknown: '확인 불가' },
          session: { active: '활성', expired: '만료', revoked: '회수됨', unknown: '확인 불가' },
          device: { compliant: '보안 기준 준수', noncompliant: '보안 기준 미준수', unknown: '확인 불가' },
        };
        const stateText = (key, value) => {
          const code = showValue(value, 'unknown');
          return `${stateLabels[key][code] || '확인 불가'}(${code})`;
        };
        const states = document.createElement('section');
        states.className = 'student-event-states';
        addText(states, 'h4', '기록 상태');
        addText(states, 'p', `접속(access): ${stateText('access', state.access)}`, 'student-event-access-state');
        addText(states, 'p', `세션(session): ${stateText('session', state.session)}`, 'student-event-session-state');
        addText(states, 'p', `기기(device): ${stateText('device', state.device)}`, 'student-event-device-state');
        detail.appendChild(states);

        // supportedActions에 전달된 항목은 실행 연결 전까지 비활성으로만 표시한다. 조치 요청은 보내지 않는다.
        const actionsFromInput = Array.isArray(selected.supportedActions)
          ? selected.supportedActions
            .filter((action) => typeof action === 'string' && action.trim())
            .map((action) => action.trim())
          : [];
        const actionsToShow = [...new Set(actionsFromInput)];
        if (actionsToShow.length > 0) {
          const actions = document.createElement('section');
          actions.className = 'student-event-actions';
          addText(actions, 'h4', '조치');
          addText(actions, 'p', '조치 실행 연결은 아직 지원하지 않습니다. 기능 준비 중이며 조치 요청은 전송되지 않습니다.');
          for (const action of actionsToShow) {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = `${action} 미지원`;
            button.disabled = true;
            actions.appendChild(button);
          }
          detail.appendChild(actions);
        }
        root.appendChild(detail);
      }
      return root;
    },
    renderStatus(input = {}) {
      const root = document.createElement('div');
      root.className = 'student-status';
      const addText = (parent, tag, value, className, role) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (role) node.setAttribute('role', role);
        node.textContent = value;
        parent.appendChild(node);
        return node;
      };
      const showValue = (value, fallback = '확인 불가') =>
        typeof value === 'string' && value.trim() ? value : fallback;
      const errorMessage = (resource) => showValue(
        resource && resource.error && resource.error.message,
        '오류 내용을 확인할 수 없습니다.',
      );

      const renderListResource = (name, resource, emptyText, describe, scopeText = '') => {
        const section = document.createElement('section');
        section.className = 'student-status-resource';
        addText(section, 'h3', name);
        if (scopeText) addText(section, 'p', scopeText, 'student-status-scope');
        if (resource && resource.status === 'loading') {
          addText(section, 'p', `${name} 조회 중입니다.`, 'student-loading', 'status');
        } else if (resource && resource.status === 'error') {
          addText(section, 'p', `${name} 조회에 실패했습니다. ${errorMessage(resource)}`, 'student-error', 'alert');
          addText(section, 'p', '화면 상단의 「다시 불러오기」를 눌러 재조회하세요.');
        } else if (resource && resource.status === 'ok') {
          if (!Array.isArray(resource.data)) {
            addText(section, 'p', `${name} 응답 형식이 올바르지 않습니다.`, 'student-unverified', 'alert');
          } else if (resource.data.length === 0) {
            addText(section, 'p', emptyText, 'student-empty', 'status');
          } else {
            addText(section, 'p', `${name} 조회 완료: ${resource.data.length}건`, 'student-ok', 'status');
            const list = document.createElement('ul');
            for (const row of resource.data) {
              const item = document.createElement('li');
              item.textContent = describe(row);
              list.appendChild(item);
            }
            section.appendChild(list);
          }
        } else {
          addText(section, 'p', `${name} 조회 상태를 확인할 수 없습니다.`, 'student-unverified', 'status');
        }
        root.appendChild(section);
      };

      const deviceLabels = {
        compliant: '보안 기준 준수',
        noncompliant: '보안 기준 미준수',
        unknown: '확인 불가',
      };
      const sessionLabels = {
        active: '활성',
        expired: '만료',
        revoked: '취소됨',
        unknown: '확인 불가',
      };
      const labeledState = (labels, value) => {
        const code = showValue(value, 'unknown');
        return `${labels[code] || '확인 불가'}(${code})`;
      };

      renderListResource('기기', input.devices, '등록된 기기가 없습니다.', (row) => {
        const value = row && typeof row === 'object' ? row : {};
        return `${showValue(value.label)} · ID: ${showValue(value.id)} · ${labeledState(deviceLabels, value.status)}`;
      });
      renderListResource(
        '세션',
        input.sessions,
        '현재 검증된 연결이 없습니다. 과거 세션 목록은 이 화면에서 조회하지 않습니다.',
        (row) => {
          const value = row && typeof row === 'object' ? row : {};
          return `ID: ${showValue(value.id)} · ${labeledState(sessionLabels, value.status)}`;
        },
        '조회 범위: 현재 검증된 연결 한 개입니다. 과거 세션 전체 목록은 아닙니다.',
      );

      const diagnostics = input.diagnostics;
      const diagnosticSection = document.createElement('section');
      diagnosticSection.className = 'student-status-diagnostics';
      addText(diagnosticSection, 'h3', '진단 정보');
      addText(diagnosticSection, 'p', '담당자에게 도움을 요청할 때 전달하기 위한 정보입니다. 표시된 진단 항목만 복사해 전달하세요.', 'student-diagnostics-purpose');
      let diagnosticInfo = null;
      if (diagnostics && diagnostics.status === 'loading') {
        addText(diagnosticSection, 'p', '진단 정보 조회 중입니다.', 'student-loading', 'status');
      } else if (diagnostics && diagnostics.status === 'error') {
        addText(diagnosticSection, 'p', `진단 정보 조회에 실패했습니다. ${errorMessage(diagnostics)}`, 'student-error', 'alert');
        addText(diagnosticSection, 'p', '제공 화면의 「도움정보 불러오기」를 눌러 재조회하세요.');
      } else if (diagnostics && diagnostics.status === 'ok'
          && Array.isArray(diagnostics.data) && diagnostics.data.length === 0) {
        addText(diagnosticSection, 'p', '진단 결과가 없습니다.', 'student-empty', 'status');
      } else if (diagnostics && diagnostics.status === 'ok'
          && diagnostics.data && typeof diagnostics.data === 'object' && !Array.isArray(diagnostics.data)) {
        const data = diagnostics.data;
        const engine = data.engine && typeof data.engine === 'object' && !Array.isArray(data.engine) ? data.engine : {};
        diagnosticInfo = {
          requestId: showValue(data.requestId),
          component: showValue(data.component),
          version: showValue(data.version),
          checkedAt: showValue(data.checkedAt),
          engine: {
            mode: showValue(engine.mode),
            code: showValue(engine.code),
          },
        };
        addText(diagnosticSection, 'p', '진단 정보 조회 완료.', 'student-ok', 'status');
        const rows = [
          ['requestId', diagnosticInfo.requestId],
          ['component', diagnosticInfo.component],
          ['version', diagnosticInfo.version],
          ['checkedAt', diagnosticInfo.checkedAt],
          ['engine.mode', diagnosticInfo.engine.mode],
          ['engine.code', diagnosticInfo.engine.code],
        ];
        const list = document.createElement('ul');
        for (const [name, value] of rows) {
          const item = document.createElement('li');
          item.textContent = `${name}: ${value}`;
          list.appendChild(item);
        }
        diagnosticSection.appendChild(list);
      } else if (diagnostics && diagnostics.status === 'ok') {
        addText(diagnosticSection, 'p', '진단 정보 응답 형식이 올바르지 않습니다.', 'student-unverified', 'alert');
      } else {
        addText(diagnosticSection, 'p', '진단 정보를 아직 조회하지 않았습니다. 제공 화면에서 「도움정보 불러오기」를 눌러 조회하세요.', undefined, 'status');
      }

      const copyButton = document.createElement('button');
      copyButton.type = 'button';
      copyButton.textContent = '도움정보 복사';
      copyButton.disabled = diagnosticInfo === null;
      copyButton.addEventListener('click', async () => {
        if (!diagnosticInfo) return;
        try {
          await navigator.clipboard.writeText(JSON.stringify(diagnosticInfo, null, 2));
          helpCopyStatus = '도움정보를 클립보드에 복사했습니다. 담당자에게 도움을 요청할 때 전달하세요.';
        } catch {
          helpCopyStatus = '클립보드 복사에 실패했습니다. 담당자에게 도움을 요청할 때 표시된 진단 항목을 직접 선택해 복사하세요.';
        }
        copyStatus.textContent = helpCopyStatus;
      });
      diagnosticSection.appendChild(copyButton);
      const copyStatus = addText(diagnosticSection, 'p', helpCopyStatus, 'student-copy-status', 'status');
      root.appendChild(diagnosticSection);

      const notificationsSection = document.createElement('section');
      notificationsSection.className = 'student-status-notifications';
      addText(notificationsSection, 'h3', '알림');
      if (Array.isArray(input.notifications) && input.notifications.length === 0) {
        addText(notificationsSection, 'p', '알림 없음', 'student-notifications-empty', 'status');
      } else if (Array.isArray(input.notifications)) {
        const list = document.createElement('ul');
        for (const notification of input.notifications) {
          const item = document.createElement('li');
          const value = notification && typeof notification === 'object' ? notification : {};
          addText(item, 'p', `resource: ${showValue(value.resource)}`);
          addText(item, 'p', `code: ${showValue(value.code)}`);
          addText(item, 'p', `message: ${showValue(value.message)}`);
          list.appendChild(item);
        }
        notificationsSection.appendChild(list);
      } else {
        addText(notificationsSection, 'p', '알림 조회 결과를 확인할 수 없습니다.', 'student-unverified', 'status');
      }
      root.appendChild(notificationsSection);
      return root;
    },
    renderVulnerabilities() { return '학생 구현 대기: 정확한 설치 버전·OSV 출처·조회 시각·부분 결과·조회 실패를 구분하세요.'; },
    renderAiConnection(input = {}) {
      const root = document.createElement('div');
      root.className = 'student-ai-connection';
      const status = input && typeof input.status === 'string' ? input.status : 'unknown';
      root.dataset.state = status;
      const addText = (tag, value, className) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        node.textContent = value;
        root.appendChild(node);
        return node;
      };
      const modeLabels = {
        connected: '연결됨(connected)',
        demo: '예제 자료(demo) · 실제 연결 아님',
        disconnected: '연결 없음(disconnected)',
        unknown: '연결 상태 확인 불가(unknown)',
      };
      const meta = input && input.meta && typeof input.meta === 'object' ? input.meta : {};
      const rawMode = typeof input.mode === 'string' ? input.mode : meta.mode;
      const mode = typeof rawMode === 'string' && Object.hasOwn(modeLabels, rawMode) ? rawMode : 'unknown';
      addText('p', `연결 모드: ${modeLabels[mode]}`, 'student-mode');

      if (status === 'idle') {
        addText('p', 'AI 연결 점검이 아직 수행되지 않았습니다. 계정 연결 및 AI 앱 승인과 별도로 「현재 API 연결 점검」을 실행하세요.', 'student-ai-idle');
        return root;
      }
      if (status === 'loading') {
        addText('p', 'AI 모델 목록 조회를 수행 중입니다. 조회가 완료되기 전에는 결과를 판단할 수 없습니다.', 'student-ai-loading');
        addText('p', '이 점검은 모델 목록 접근 확인이며 사건 설명 요청을 실행하지 않습니다.', 'student-ai-separation');
        return root;
      }
      if (status === 'error') {
        const knownCodes = Object.keys(AI_MESSAGES);
        const rawCode = input.error && input.error.code;
        const code = typeof rawCode === 'string' && knownCodes.includes(rawCode) ? rawCode : 'AI_REQUEST_UNVERIFIED';
        let category = 'AI 연결 또는 응답 확인 오류';
        if (['WB_CLCO_AUTH_REQUIRED', 'WB_CLCO_INVALID_TOKEN'].includes(code)) category = '인증 오류';
        else if (['ON_AI_PROVISIONING_PENDING', 'ON_AI_AUTHORIZATION_CHANGED', 'WB_CLCO_ACCESS_BLOCKED'].includes(code)) category = '앱 인가·이용 권한 오류';
        else if (code === 'WB_CLCO_COHORT_BUDGET_EXHAUSTED') category = '반 공동 사용량 한도 초과';
        else if (code === 'WB_CLCO_RATE_LIMITED') category = '요청 빈도 제한';
        else if (code === 'WB_CLCO_LIMIT_REACHED') category = 'AI 이용 한도 초과';
        else if (code === 'WB_CLCO_SESSION_CLOSED') category = 'AI 이용 시간 제한';
        else if (['WB_CLCO_TIMEOUT', 'REQUEST_TIMEOUT', 'ENGINE_TIMEOUT', 'TIMEOUT'].includes(code)) category = '요청 시간 초과';
        else if (['WB_CLCO_CANCELLED', 'CANCELLED', 'REQUEST_CANCELLED'].includes(code)) category = '요청 취소';
        else if (code === 'ON_AI_MODEL_LIST_EMPTY') category = '허용된 모델 없음';
        else if (code === 'MODEL_NOT_CONFIGURED') category = '모델 설정 누락';
        else if (['WB_CLCO_NETWORK_ERROR', 'NETWORK_ERROR'].includes(code)) category = '네트워크 오류';
        else if (code === 'WB_CLCO_SERVER_UNAVAILABLE') category = 'AI 서버 사용 불가';
        else if (code === 'SUBJECT_SCOPE_UNVERIFIED') category = '계정·사건 범위 검증 실패';
        else if (['ON_AI_INVALID_INPUT', 'ON_AI_INVALID_OUTPUT', 'WB_CLCO_INVALID_RESPONSE'].includes(code)) category = '요청 또는 응답 형식 오류';
        const suppliedMessage = input.error && input.error.message;
        const message = typeof suppliedMessage === 'string' && safeAiText(suppliedMessage, 500)
          ? suppliedMessage
          : AI_MESSAGES[code];
        addText('p', `AI 연결 점검 실패: ${category}`, 'student-ai-error');
        addText('p', `오류 코드: ${code}`, 'student-ai-error-code');
        addText('p', `오류 내용: ${message}`, 'student-ai-error-message');
        if (['WB_CLCO_AUTH_REQUIRED', 'WB_CLCO_INVALID_TOKEN'].includes(code)) {
          addText('p', '「계정 연결 확인」에서 현재 계정 연결을 다시 확인하세요. 인증 오류가 계속되면 담당자에게 앱 전용 인증 상태를 문의하세요. Workbench 열쇠를 복사하거나 입력하지 마세요.', 'student-ai-error-guidance');
        } else if (['ON_AI_PROVISIONING_PENDING', 'ON_AI_AUTHORIZATION_CHANGED', 'WB_CLCO_ACCESS_BLOCKED'].includes(code)) {
          addText('p', '「계정 연결 확인」에서 현재 계정 연결을 다시 확인한 뒤, 문제가 계속되면 담당자에게 학생 앱 AI 이용 권한의 발급·연결 상태를 문의하세요.', 'student-ai-error-guidance');
        }
        addText('p', '이 결과는 사건 설명 요청의 실행 결과가 아닙니다. 자동 재점검은 하지 않습니다. 다시 점검하려면 버튼을 직접 누르세요.', 'student-ai-separation');
        return root;
      }
      if (status !== 'ok') {
        addText('p', 'AI 연결 점검의 처리 상태를 확인할 수 없습니다. 이전 점검 결과를 현재 성공으로 표시하지 않습니다.', 'student-ai-unverified');
        return root;
      }

      const data = input.data;
      // 학생 UI 입력 계약은 checkedAt을 최상위 필드로 전달한다.
      const checkedAt = input.checkedAt;
      const validTime = typeof checkedAt === 'string' && safeAiTime(checkedAt);
      if (!data || typeof data !== 'object' || data.transportChecked !== true
          || !['test', 'verified'].includes(data.audienceAuthorization)
          || !Number.isInteger(data.modelCount) || data.modelCount < 0 || data.modelCount > 10000 || !validTime) {
        addText('p', 'AI 연결 점검 응답이 공식 계약을 충족하지 않거나 점검 시각을 검증할 수 없습니다. 연결 성공으로 판단하지 마세요.', 'student-ai-unverified');
        return root;
      }
      const authorization = data.audienceAuthorization;
      addText('p', authorization === 'test'
        ? '시험용 전송 경로의 모델 목록 조회(test) · 실제 앱 권한이나 게이트 수용을 검증한 결과가 아닙니다.'
        : '앱 권한 검증 후 모델 목록 조회(verified) · 표시된 점검 시점의 결과입니다.', 'student-ai-result');
      const details = document.createElement('dl');
      details.className = 'student-ai-check-details';
      const rows = [
        ['조회된 모델 수', String(data.modelCount)],
        ['점검 시각', `${new Date(checkedAt).toLocaleString('ko-KR')} (${checkedAt})`],
      ];
      for (const [label, value] of rows) {
        const term = document.createElement('dt');
        term.textContent = label;
        const description = document.createElement('dd');
        description.textContent = value;
        details.append(term, description);
      }
      root.appendChild(details);
      addText('p', '이 결과는 점검 시점의 API 모델 목록 조회만 확인했습니다. 보안 사건 설명은 실행하지 않았으며, 설명 응답은 보안 기록에서 별도로 요청하고 검증해야 합니다.', 'student-ai-separation');
      return root;
    },
    renderExplanation(input = {}) {
      const root = document.createElement('div');
      root.className = 'student-explanation';
      const explanation = input && input.explanation && typeof input.explanation === 'object' ? input.explanation : {};
      const event = input && input.event && typeof input.event === 'object' ? input.event : null;
      const status = typeof explanation.status === 'string' ? explanation.status : 'unknown';
      root.dataset.state = status;
      const addText = (parent, tag, value, className) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        node.textContent = value;
        parent.appendChild(node);
        return node;
      };
      const showFailure = (title, error) => {
        const knownCodes = Object.keys(AI_MESSAGES);
        const rawCode = error && error.code;
        const code = typeof rawCode === 'string' && knownCodes.includes(rawCode) ? rawCode : 'AI_REQUEST_UNVERIFIED';
        const rawMessage = error && error.message;
        const message = typeof rawMessage === 'string' && safeAiText(rawMessage, 500) ? rawMessage : AI_MESSAGES[code];
        addText(root, 'p', `${title}: ${code}`, 'student-explanation-error');
        addText(root, 'p', message, 'student-explanation-error-message');
        addText(root, 'p', '보안 기록은 변경되지 않았습니다. 설명 요청 실패로 조치는 실행되지 않았습니다.', 'student-explanation-unchanged');
      };

      if (!event) {
        addText(root, 'p', '보안 기록에서 사건을 먼저 선택하세요. 선택된 사건이 없어 설명 결과를 표시할 수 없습니다.', 'student-explanation-empty');
        return root;
      }
      if (status === 'idle') {
        addText(root, 'p', `사건 ${safeAiId(event.id) ? event.id : 'ID 확인 불가'}의 AI 설명 요청은 아직 실행되지 않았습니다. 설명 결과를 확인하려면 별도로 요청해야 합니다.`, 'student-explanation-idle');
        return root;
      }
      if (status === 'loading') {
        addText(root, 'p', `사건 ${safeAiId(event.id) ? event.id : 'ID 확인 불가'}의 근거를 사용해 AI 설명 요청을 처리 중입니다. 응답을 검증하기 전에는 설명 결과가 아닙니다.`, 'student-explanation-loading');
        return root;
      }
      if (status === 'error') {
        showFailure('AI 설명 요청 실패', explanation.error);
        return root;
      }
      if (status !== 'ok') {
        addText(root, 'p', 'AI 설명 요청의 처리 상태를 확인할 수 없습니다. 확인되지 않은 상태를 성공으로 표시하지 않습니다.', 'student-explanation-unverified');
        return root;
      }

      const data = explanation.data;
      const validated = validExplanation(data, event);
      const validState = event.state && typeof event.state === 'object'
        && ['allowed', 'denied', 'unknown'].includes(event.state.access)
        && ['active', 'expired', 'revoked', 'unknown'].includes(event.state.session)
        && ['compliant', 'noncompliant', 'unknown'].includes(event.state.device);
      if (!validated || !validState || !safeAiId(event.id)) {
        addText(root, 'p', '설명 응답이 공식 응답 계약을 충족하지 않거나 선택한 사건의 근거·조치와 일치하지 않아 표시할 수 없습니다.', 'student-explanation-rejected');
        addText(root, 'p', '오류 코드: ON_AI_INVALID_OUTPUT', 'student-explanation-error-code');
        addText(root, 'p', AI_MESSAGES.ON_AI_INVALID_OUTPUT, 'student-explanation-error-message');
        addText(root, 'p', '보안 기록은 변경되지 않았으며, 계약 검증에 실패한 응답의 내용은 표시하지 않습니다.', 'student-explanation-unchanged');
        return root;
      }

      // 성공 표식은 선택된 사건과 검증된 설명이 정확히 결속된 경우에만 붙인다.
      root.setAttribute('data-student-explanation-event', event.id);
      addText(root, 'h3', `사건 ${event.id} · AI 설명(참고용)`, 'student-explanation-title');
      addText(root, 'p', `원본 사건 요약: ${event.summary}`, 'student-explanation-event-summary');
      addText(root, 'p', validated.summary, 'student-explanation-summary');
      if (typeof input.checkedAt === 'string' && safeAiTime(input.checkedAt)) {
        addText(root, 'p', `설명 확인 시각: ${new Date(input.checkedAt).toLocaleString('ko-KR')} (${input.checkedAt})`, 'student-explanation-time');
      }

      const evidenceSection = document.createElement('section');
      evidenceSection.className = 'student-explanation-evidence';
      addText(evidenceSection, 'h4', '인용 근거');
      const evidenceById = new Map(event.evidence.map((row) => [row.id, row]));
      const evidenceList = document.createElement('ul');
      for (const evidenceId of validated.evidenceIds) {
        const evidence = evidenceById.get(evidenceId);
        const item = document.createElement('li');
        item.textContent = `${evidence.id} — ${evidence.text}`;
        evidenceList.appendChild(item);
      }
      evidenceSection.appendChild(evidenceList);
      root.appendChild(evidenceSection);

      const rulesSection = document.createElement('section');
      rulesSection.className = 'student-explanation-rules';
      addText(rulesSection, 'h4', '사건 규칙');
      const rulesList = document.createElement('ul');
      for (const rule of event.rules) {
        const item = document.createElement('li');
        item.textContent = `${rule.id} — ${rule.text}`;
        rulesList.appendChild(item);
      }
      rulesSection.appendChild(rulesList);
      root.appendChild(rulesSection);

      const stateLabels = {
        access: { allowed: '허용됨', denied: '거부됨', unknown: '확인 불가' },
        session: { active: '활성', expired: '만료', revoked: '회수됨', unknown: '확인 불가' },
        device: { compliant: '기준 충족', noncompliant: '기준 미충족', unknown: '확인 불가' },
      };
      const stateNames = { access: '접속', session: '세션', device: '기기' };
      const stateSection = document.createElement('section');
      stateSection.className = 'student-explanation-states';
      addText(stateSection, 'h4', '사건의 원천 상태');
      for (const key of ['access', 'session', 'device']) {
        const value = event.state[key];
        addText(stateSection, 'p', `${stateNames[key]}: ${stateLabels[key][value]}(${value})`,
          value === 'unknown' ? 'student-explanation-state-unknown' : 'student-explanation-state');
      }
      const unknownStates = ['access', 'session', 'device'].filter((key) => event.state[key] === 'unknown');
      addText(stateSection, 'p', unknownStates.length
        ? `확인 불가 상태: ${unknownStates.map((key) => `${stateNames[key]}(unknown)`).join(', ')}. 정상·안전으로 간주하지 않습니다.`
        : '확인 불가 상태: 없음.', 'student-explanation-unknown-summary');
      root.appendChild(stateSection);

      const proposalSection = document.createElement('section');
      proposalSection.className = 'student-explanation-proposals';
      addText(proposalSection, 'h4', 'AI 조치 제안');
      if (validated.proposals.length === 0) {
        addText(proposalSection, 'p', event.supportedActions.length === 0
          ? '원천이 지원하는 조치가 없어 제안이 없습니다. 이는 조치 제안이 없는 상태이며, 사건이 정상·안전하다는 판정은 아닙니다.'
          : 'AI가 제안한 조치가 없습니다.', 'student-explanation-no-proposals');
      } else {
        addText(proposalSection, 'p', '아래 내용은 제안일 뿐이며 사람이 확인해야 합니다. 어떤 조치도 아직 실행되지 않았습니다.', 'student-explanation-proposal-not-executed');
        const proposals = document.createElement('ul');
        for (const proposal of validated.proposals) {
          const item = document.createElement('li');
          addText(item, 'p', `조치: ${proposal.action}`);
          addText(item, 'p', `제안 이유: ${proposal.reason}`);
          addText(item, 'p', `근거 ID: ${proposal.evidenceIds.join(', ')}`);
          proposals.appendChild(item);
        }
        proposalSection.appendChild(proposals);
      }
      root.appendChild(proposalSection);
      addText(root, 'p', 'AI 설명은 참고용입니다. 판정·탐지·조치 집행을 대신하지 않습니다.', 'student-explanation-disclaimer');
      return root;
    },
    renderAction() { return '학생 구현 대기: 현재 사건·조치·실제 대상·사람 확인·ACK와 원천 효과·unknown을 구분하세요.'; },
  };
}
