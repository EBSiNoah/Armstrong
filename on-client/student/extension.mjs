// 이 파일은 학생이 같은 프로젝트에서 이어서 구현합니다.
// 제공 UI를 받은 것만으로 단계 완료를 인정하지 않습니다.
export function createStudentView() {
  let eventFilters = { kind: 'all', appId: 'all', access: 'all' };
  let selectedEventId = null;

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
        revoked: '회수됨',
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
        addText(root, 'p', '보안 기록을 불러오는 중…', 'student-events-loading');
        return root;
      }
      if (input.status === 'error') {
        // 실패 상태에서는 이전 상세 선택도 폐기하고 이전 목록을 재사용하지 않는다.
        selectedEventId = null;
        const message = showValue(input.error && input.error.message, '오류 내용을 확인할 수 없습니다.');
        addText(root, 'p', `기록을 불러오지 못했습니다. ${message}`, 'student-events-error');
        return root;
      }
      if (input.status !== 'ok' || !Array.isArray(input.data)) {
        addText(root, 'p', '보안 기록을 확인할 수 없습니다.', 'student-events-unverified');
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
        addText(root, 'p', events.length === 0 ? '표시할 기록이 없습니다.' : '선택한 필터와 일치하는 기록이 없습니다.', 'student-events-empty');
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
          if (!Array.isArray(event.supportedActions) || event.supportedActions.length === 0) {
            addText(item, 'p', '지원 조치가 없습니다. 조치 버튼을 표시하지 않습니다.', 'student-event-no-actions');
          }
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

        const addTextRows = (heading, rows, className) => {
          const section = document.createElement('section');
          section.className = className;
          addText(section, 'h4', heading);
          if (!Array.isArray(rows) || rows.length === 0) {
            addText(section, 'p', '표시할 내용이 없습니다.');
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
        addTextRows('근거 (evidence)', selected.evidence, 'student-event-evidence');
        addTextRows('규칙 (rules)', selected.rules, 'student-event-rules');

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
        addText(states, 'h4', '현재 상태');
        addText(states, 'p', `접속(access): ${stateText('access', state.access)}`, 'student-event-access-state');
        addText(states, 'p', `세션(session): ${stateText('session', state.session)}`, 'student-event-session-state');
        addText(states, 'p', `기기(device): ${stateText('device', state.device)}`, 'student-event-device-state');
        detail.appendChild(states);
        root.appendChild(detail);
      }
      return root;
    },
    renderStatus() { return '학생 구현 대기: 기기·세션·알림과 연결 점검 상태를 구분하세요.'; },
    renderVulnerabilities() { return '학생 구현 대기: 정확한 설치 버전·OSV 출처·조회 시각·부분 결과·조회 실패를 구분하세요.'; },
    renderAiConnection() { return '학생 구현 대기: 모델 응답 점검과 실제 사건 설명을 구분하고 AI 오류·취소·수동 복구를 안내하세요.'; },
    renderExplanation() { return '학생 구현 대기: 선택한 사건의 근거·규칙·현재 상태와 AI 설명을 연결하세요. 제안은 자동 실행하지 않습니다.'; },
    renderAction() { return '학생 구현 대기: 현재 사건·조치·실제 대상·사람 확인·ACK와 원천 효과·unknown을 구분하세요.'; },
  };
}
