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
        compliant: '보안 기준 충족',
        noncompliant: '보안 기준 미충족',
        unknown: '확인 불가',
      };
      const sessionLabels = {
        active: '활성',
        expired: '만료',
        revoked: '철회됨',
        unknown: '확인 불가',
      };
      const stateText = (labels, value) => {
        const original = safeText(value, 'unknown');
        return `${labels[original] || '확인 불가'}(${original})`;
      };
      const modeLabels = {
        connected: '연결됨(connected)',
        demo: '예제 자료(demo) · 실제 연결 아님',
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
          addText(section, 'p', `${name}을(를) 불러오지 못했습니다. 확인 불가. ${message}`, 'student-error');
        } else if (status === 'ok') {
          if (allowOkData) renderOk(section, resource.data);
          else addText(section, 'p', blockedMessage || '현재 로그인 정보를 확인할 수 없어 이전 정보를 표시하지 않습니다.');
        } else {
          addText(section, 'p', `${name}: 확인 불가 (상태를 확인할 수 없습니다)`);
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
    renderDecision() { return '학생 구현 대기: 서버의 판정과 이유를 연결하세요.'; },
    renderEvents() { return '학생 구현 대기: 본인 접속·XDR 기록을 연결하세요.'; },
    renderStatus() { return '학생 구현 대기: 기기·세션·알림과 연결 점검 상태를 구분하세요.'; },
    renderVulnerabilities() { return '학생 구현 대기: 정확한 설치 버전·OSV 출처·조회 시각·부분 결과·조회 실패를 구분하세요.'; },
    renderAiConnection() { return '학생 구현 대기: 모델 응답 점검과 실제 사건 설명을 구분하고 AI 오류·취소·수동 복구를 안내하세요.'; },
    renderExplanation() { return '학생 구현 대기: 선택한 사건의 근거·규칙·현재 상태와 AI 설명을 연결하세요. 제안은 자동 실행하지 않습니다.'; },
    renderAction() { return '학생 구현 대기: 현재 사건·조치·실제 대상·사람 확인·ACK와 원천 효과·unknown을 구분하세요.'; },
  };
}
