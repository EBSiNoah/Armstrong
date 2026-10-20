// 이 파일은 학생이 같은 프로젝트에서 이어서 구현합니다.
// 제공 UI를 받은 것만으로 단계 완료를 인정하지 않습니다.
export function createStudentView() {
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
      const originalCode = typeof decision === 'string' && decision.trim()
        ? decision
        : '알 수 없는 값';
      const decisionLabel = Object.hasOwn(decisions, decision) ? decisions[decision] : '판정 확인 불가';
      addText('p', `${decisionLabel}(${originalCode})`, 'student-decision-result');

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
    renderEvents() { return '학생 구현 대기: 본인 접속·XDR 기록을 연결하세요.'; },
    renderStatus() { return '학생 구현 대기: 기기·세션·알림과 연결 점검 상태를 구분하세요.'; },
    renderVulnerabilities() { return '학생 구현 대기: 정확한 설치 버전·OSV 출처·조회 시각·부분 결과·조회 실패를 구분하세요.'; },
    renderAiConnection() { return '학생 구현 대기: 모델 응답 점검과 실제 사건 설명을 구분하고 AI 오류·취소·수동 복구를 안내하세요.'; },
    renderExplanation() { return '학생 구현 대기: 선택한 사건의 근거·규칙·현재 상태와 AI 설명을 연결하세요. 제안은 자동 실행하지 않습니다.'; },
    renderAction() { return '학생 구현 대기: 현재 사건·조치·실제 대상·사람 확인·ACK와 원천 효과·unknown을 구분하세요.'; },
  };
}
