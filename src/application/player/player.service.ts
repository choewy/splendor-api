import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayerService {
  // TODO 플레이어 검색 조회
  async search() {
    return;
  }

  // TODO 플레이어 상세 정보 조회
  async get() {
    return;
  }

  // TODO 플레이어 친구 추가(양방향, 요청 승인 구조)
  async follow() {
    return;
  }

  // TODO 플레이어 친구 삭제(단방향, 일방적 구조)
  async unfollow() {
    return;
  }

  // TODO 플레이어 차단
  async block() {
    return;
  }
}
