// this supports comments too!
// though not multiline yet
Fn0:
        nop 
        set_episode 0x00000001
        BB_Map_Designate 0x00, 0x0012, 00, 00
        BB_Map_Designate 0x01, 0x0013, 00, 00
        BB_Map_Designate 0x04, 0x0016, 00, 00
        BB_Map_Designate 0x07, 0x0019, 00, 00
        BB_Map_Designate 0x0A, 0x001C, 00, 00
        BB_Map_Designate 0x11, 0x0023, 00, 00
        set_floor_handler 0x00000000, Fn50
        set_floor_handler 0x00000001, Fn100
        set_floor_handler 0x00000004, Fn110
        set_floor_handler 0x00000007, Fn120
        set_floor_handler 0x0000000A, Fn130
        set_floor_handler 0x00000011, Fn140
        set_qt_failure Fn1400
        set_qt_success Fn1400
        initial_floor 0x00000001
        set R75
        set_quest_board_handler 0x00000000, 200, 'Results'
        set_quest_board_handler 0x00000001, 990, 'Timer Control'
        set_qt_failure Fn1400
        get_slotnumber R250
        leti R72, 0x00000046
        get_difficulty_level2 R252
Fn3:
        get_number_of_player2 R251
        leti R102, 0x00000028
        leti R120, 0x0000000A
        leti R121, 0x00000008
        leti R122, 0x00000007
        leti R123, 0x00000008
        leti R124, 0x0000000E
Fn1:
        ret 
Fn4:
        set R255
        ret 
Fn2:
        enable_movement2 R250
        unfreeze_enemies 
        ret 
Fn50:
        call Fn506
        leti R60, 0x00000000
        leti R61, 0x0000001E
        leti R62, 0x00000001
        leti R63, 0x00000001
        jmpi_equ R253, 0x00000001, 1
        jmpi_equ R254, 0x00000000, 1
        jmpi_neq R252, 0x00000003, 4
        unhide_ene R60
        disable_movement2 R250
        freeze_enemies 
        message 0x0000014E, 'WOW!'
        add_msg 'We watched your performance'
        add_msg 'and were really impressed.'
        set R255
        set R74
        add_msg 'We wanted to<cr>give you something'
        add_msg 'to show how much<cr>we enjoyed watching.'
Fn51:
        BB_get_number_in_pack R19
        freeze_enemies 
        jmpi_neq R19, 0x0000001E, Fn53
        jmpi_equ R20, 0x00000001, Fn52
        message 0x0000014E, "But it looks like you<cr>don't have room to carry it."
        add_msg "Go and put some of that<cr>stuff down somewhere<cr>and come back."
        mesend 
        set R20
        enable_movement2 R250
        unfreeze_enemies 
        ret 
Fn52:
        message 0x0000014E, "You still don't have room<cr>to carry our gift."
        add_msg 'Go and put some of that<cr>stuff down somewhere<cr>and come back.'
        mesend 
        enable_movement2 R250
        unfreeze_enemies 
        ret 
Fn53:
        nop 
        mesend 
        call Fn2500
        set R255
        set R74
        window_msg 'You recieved a <color 5>Present<color 0>.'
        winend 
        message 0x0000014E, 'We hope you enjoy our gift!'
        add_msg 'Come and play again sometime!'
        mesend 
        enable_movement2 R250
        unfreeze_enemies 
        ret 
Fn54:
        disable_movement2 R250
        freeze_enemies 
        message 0x0000014E, 'Here you go.'
        mesend 
        jmp Fn51
Fn60:
        disable_movement2 R250
        freeze_enemies 
        BB_get_number_in_pack R19
        jmpi_equ R255, 0x00000001, Fn61
        jmpi_equ R19, 0x0000001E, Fn52
        jmpi_neq R255, 0x00000001, Fn54
Fn61:
        message 0x0000014E, 'Come and play again sometime!'
        mesend 
        enable_movement2 R250
        unfreeze_enemies 
        ret 
Fn90:
        nop 
        disable_movement2 R250
        window_msg 'Ready?'
        list R10, 'Yes<cr>No'
        winend 
        jmpi_equ R10, 0x00000001, 2
        thread_stg Fn97
        switch_call R250, Fn91 | Fn92 | Fn93 | Fn94
Fn95:
        sync 
        get_number_of_player2 R251
        clear R15
        add R15, R11
        add R15, R12
        add R15, R13
        add R15, R14
        jmp_lss R15, R251, 95
        call Fn3
        call Fn502
        unlock_door2 0x00000001, 0x00000028
        window_msg 'GO!'
        winend 
        enable_movement2 R250
        thread Fn96
        jmp 101
Fn91:
        sync_register R11, 0x00000001
        ret 
Fn92:
        sync_register R12, 0x00000001
        ret 
Fn93:
        sync_register R13, 0x00000001
        ret 
Fn94:
        sync_register R14, 0x00000001
        ret 
Fn96:
        call Fn505
        lock_door2 0x00000001, 0x00000028
        leti R16, 0x00000001
        leti R17, 0x00000065
        leti R18, 0x00000001
        unhide_obj R16
        ret 
Fn97:
        sync 
        clear R25
Fn98:
        scroll_text 0x000000C8, 0x000000C8, 0x0000000A, 0x00000006, 0x00000002, 0x01, R25, 'Please wait for all<cr>players...'
        call Fn411
        jmp_lss R15, R251, Fn98
        ret 
Fn500:
        switch_call R250, Fn91 | Fn92 | Fn93 | Fn94
Fn520:
        sync 
        clear R15
        add R15, R11
        add R15, R12
        add R15, R13
        add R15, R14
        jmp_lss R15, R251, Fn920
        unhide_obj R70
        sync_register R102, R102
        gettime R101
        add R101, R102
        window_time 
Fn501:
        call Fn502
        gettime R100
        jmp_gtr R100, R101, Fn509
        jmpi_equ R50, 0x00000064, Fn510
        let R102, R101
        sub R102, R100
        winset_time R102
        jmpi_equ R99, 0x00000001, 1
        jmp Fn501
Fn502:
        call Fn503
        call Fn503
        call Fn503
        call Fn503
        call Fn503
        call Fn503
        ret 
Fn503:
        sync 
        sync 
        sync 
        sync 
        sync 
        ret 
Fn504:
        call Fn502
        call Fn502
        call Fn502
        call Fn502
        call Fn502
Fn505:
        call Fn502
        call Fn502
        call Fn502
        call Fn502
        call Fn502
        ret 
Fn506:
        window_time 
        winset_time R102
        ret 
Fn509:
        set R253
        set R74
        clear R255
        clear R254
        set R99
        disable_movement2 R250
        freeze_enemies 
        window_msg 'You have run out of time! You made it <r50> waves.'
        winend 
        fadeout 
        p_return_guild 
        enable_movement2 R250
        unfreeze_enemies 
        fadein 
        ret 
Fn510:
        set R254
        set R74
        call Fn502
        disable_movement2 R250
        window_msg 'You have completed the quest!'
        add_msg 'You will be warped back to pioneer2 in 30 seconds.'
        winend 
        enable_movement2 R250
        call Fn504
        call Fn504
        call Fn504
        fadeout 
        call Fn502
        clear R21
        go_floor R250, R21
        fadein 
        ret 
Fn400:
        leti R3, 0x00000001
Fn401:
        sync 
        if_switch_pressed R2
        jmpi_equ R4, 0x00000000, Fn401
        add R101, R1
        addi R50, 0x00000001
        addi R3, 0x00000001
        thread_stg Fn410
        jmpi_leq R3, 0x00000014, Fn401
        set R99
        ret 
Fn410:
        sync 
        clear R25
        scroll_text 0x000000C8, 0x000000C8, 0x0000000A, 0x00000006, 0x00000002, 0x01, R25, '<r1> seconds added.'
Fn411:
        sync 
        sync 
        sync 
        jmpi_equ R25, 0x00000000, Fn411
        ret 
Fn600:
        call 505
        scroll_text 0x000000C8, 0x000000C8, 0x0000000A, 0x00000006, 0x00000002, 0x01, R26, "You've completed this<cr>stage."
Fn601:
        sync 
        sync 
        sync 
        jmpi_equ R26, 0x00000000, Fn601
        go_floor R250, R2
        ret 
Fn100:
        p_disablewarp 
        ret 
Fn101:
        clear R99
        leti R70, 0x00000001
        leti R71, 0x0000000B
        thread_stg Fn500
        va_start 
        arg_pushr R120
        arg_pushl 0x00000001
        va_call Fn400
        va_end 
        set R99
        va_start 
        arg_pushr R120
        arg_pushl 0x00000004
        va_call Fn600
        va_end 
        ret 
Fn110:
        clear R99
        leti R70, 0x00000004
        leti R71, 0x0000001F
        p_disablewarp 
        thread_stg Fn500
        va_start 
        arg_pushr R121
        arg_pushl 0x00000004
        va_call Fn400
        va_end 
        set R99
        va_start 
        arg_pushr R121
        arg_pushl 0x00000007
        va_call Fn600
        va_end 
        ret 
Fn120:
        clear R99
        leti R70, 0x00000007
        leti R71, 0x00000008
        p_disablewarp 
        thread_stg Fn500
        va_start 
        arg_pushr R122
        arg_pushl 0x00000007
        va_call Fn400
        va_end 
        set R99
        va_start 
        arg_pushr R122
        arg_pushl 0x0000000A
        va_call Fn600
        va_end 
        ret 
Fn130:
        clear R99
        leti R70, 0x0000000A
        leti R71, 0x00000014
        p_disablewarp 
        thread_stg Fn500
        va_start 
        arg_pushr R123
        arg_pushl 0x0000000A
        va_call Fn400
        va_end 
        set R99
        va_start 
        arg_pushr R123
        arg_pushl 0x00000011
        va_call Fn600
        va_end 
        ret 
Fn140:
        clear R99
        leti R70, 0x00000011
        leti R71, 0x0000001E
        p_disablewarp 
        call Fn800
        thread_stg Fn500
        va_start 
        arg_pushr R124
        arg_pushl 0x00000011
        va_call Fn400
        va_end 
        ret 
Fn800:
        sync 
        jmpi_equ R155, 0x00000001, Fn1
        set R155
        leti R140, 0x00004E20
        leti R141, 0x00000046
        leti R142, 0x0000001E
        leti R143, 0x00004E20
        leti R144, 0x00000006
        leti R145, 0x00000000
        leti_fixed_camera_V3 R140
        ret 
Fn200:
        jmpi_equ R253, 0x00000001, Fn201
        switch_jmp R252, Fn210 | Fn220 | Fn230 | Fn240
Fn201:
        switch_jmp R252, Fn211 | Fn221 | Fn231 | Fn241
Fn210:
        disp_msg_qb 'You cleared <r50> waves on Normal.<cr>You had <r102> seconds left.'
        jmp Fn202
Fn220:
        disp_msg_qb 'You cleared <r50> waves on Hard.<cr>You had <r102> seconds left.'
        jmp Fn202
Fn230:
        disp_msg_qb 'You cleared <r50> waves on Very Hard.<cr>You had <r102> seconds left.'
        jmp Fn202
Fn240:
        disp_msg_qb 'You cleared <r50> waves on Ultimate.<cr>You had <r102> seconds left.'
        jmp Fn202
Fn211:
        disp_msg_qb 'You cleared <r50> waves on Normal.'
        jmp Fn202
Fn221:
        disp_msg_qb 'You cleared <r50> waves on Hard.'
        jmp Fn202
Fn231:
        disp_msg_qb 'You cleared <r50> waves on Very Hard.'
        jmp Fn202
Fn241:
        disp_msg_qb 'You cleared <r50> waves on Ultimate.'
        jmp Fn202
Fn202:
        close_msg_qb 
        ret 
Fn809:
        jmpi_equ R155, 0x00000000, Fn1
        clear R155
        default_camera_pos1 
        ret 
Fn990:
        nop 
        list R180, 'View Times<cr>Timer off<cr>Timer on<cr>Set Time<cr>Win'
        switch_jmp R180, Fn999 | Fn991 | Fn992 | Fn993 | Fn1001
Fn991:
        sync_register R102, 0x0000FFFF
        ret 
Fn992:
        sync_register R102, 0x0000000F
        ret 
Fn993:
        list R180, 'Initial<cr>Temple<cr>Spaceship<cr>Jungle<cr>Seabed<cr>Tower'
        list R181, '8<cr>9<cr>10<cr>11<cr>12<cr>13<cr>14<cr>15<cr>16<cr>17<cr>18<cr>19<cr>20'
        addi R181, 0x00000008
        switch_jmp R180, Fn1000 | Fn994 | Fn995 | Fn996 | Fn997 | Fn998
Fn994:
        sync_register R120, R181
        ret 
Fn995:
        sync_register R121, R181
        ret 
Fn996:
        sync_register R122, R181
        ret 
Fn997:
        sync_register R123, R181
        ret 
Fn998:
        sync_register R124, R181
        ret 
Fn999:
        disp_msg_qb '0: <r102> | 1: <r120> | 2: <r121><cr>3: <r122> | 4: <r123> | 5: <r124><cr>254: <r254>'
        close_msg_qb 
        ret 
Fn1000:
        sync_register R102, R181
        ret 
Fn1001:
        set R254
        clear R255
        ret 
Fn1400:
        nop 
        disable_movement2 R250
        let R20, R50
        mul R20, R251
        addi R252, 0x00000001
        mul R20, R252
        muli R20, 0x000000FA
        window_msg 'You cleared <r 50> waves.'
        add_msg 'Here is your reward of <color 3><r20><color 0> meseta.'
        pl_add_meseta2 R20
        jmpi_equ R255, 0x00000001, Fn1401
        add_msg 'Come and try again later!'
        winend 
Fn1401:
        QEXIT 
        ret 
Fn2500:
        leti R1, 0x00000001
        leti R2, 0x00000005
        get_random R1, R10
        sync 
        sync 
        sync 
        get_random R1, R12
        leti R1, 0x00000006
        sync 
        sync 
        leti R2, 0x0000000A
        get_random R1, R11
        sync 
        sync 
        sync 
        get_random R1, R13
        jmp_neq R10, R12, Fn2501
        add R11, R13
        clear R12
        clear R13
Fn2501:
        leti R1, 0x00000001
        leti R2, 0x00002710
        sync 
        get_random R1, R16
        jmpi_gtr R16, 0x00002134, Fn2520
        let R14, R16
        modi R14, 0x00000004
        addi R14, 0x00000001
        leti R15, 0x00000014
        sub R15, R13
        sub R15, R11
Fn2503:
        muli R11, 0x00000005
        muli R13, 0x00000005
        muli R15, 0x00000005
        jmpi_neq R14, 0x00000005, Fn2513
        leti R1, 0x00000000
        leti R2, 0x0000000B
        sync 
        get_random R1, R16
        clear R4
        clear R5
        clear R6
        clear R9
        leti R7, 0x00000000
        leti R8, 0x00000040
        call 2508
        call 2504
        switch_call R16, Fn2650 | Fn2651 | Fn2652 | Fn2653 | Fn2654 | Fn2655 | Fn2656 | Fn2657 | Fn2658 | Fn2659 | Fn2660 | Fn2661
        item_create2 R4, R16
        ret 
Fn2513:
        leti R1, 0x00000000
        leti R2, 0x00000008
        sync 
        get_random R1, R16
        clear R4
        clear R5
        clear R6
        clear R7
        leti R8, 0x00000040
        clear R9
        call 2508
        call 2504
        switch_call R16, Fn2650 | Fn2651 | Fn2652 | Fn2654 | Fn2655 | Fn2656 | Fn2658 | Fn2659 | Fn2660
        item_create R4, R16
        window_msg '<r16>'
        winend 
        ret 
Fn2504:
        jmpi_leq R11, 0x00000064, Fn2505
        leti R11, 0x00000064
Fn2505:
        jmpi_leq R13, 0x00000064, Fn2506
        leti R13, 0x00000064
Fn2506:
        jmpi_leq R15, 0x00000064, Fn2507
        leti R15, 0x00000064
Fn2507:
        ret 
Fn2508:
        jmp_neq R10, R12, Fn2509
        add R11, R13
        clear R12
        clear R13
Fn2509:
        jmp_neq R12, R14, Fn2510
        add R13, R15
        clear R14
        clear R15
Fn2510:
        jmp_neq R10, R14, Fn1
        add R11, R15
        clear R14
        clear R15
        ret 
Fn2520:
        leti R14, 0x00000005
        leti R1, 0x00000001
        leti R2, 0x000003E8
        get_random R1, R16
        jmpi_leq R16, 0x0000002D, Fn2602 
        jmpi_leq R16, 0x00000064, Fn2603
        jmpi_leq R16, 0x000000AA, Fn2604
        jmpi_leq R16, 0x000000FA, Fn2605
        jmpi_leq R16, 0x0000015E, Fn2606
        jmpi_leq R16, 0x000001C2, Fn2607
        jmpi_leq R16, 0x00000226, Fn2608
        jmpi_leq R16, 0x0000028A, Fn2609
        jmpi_leq R16, 0x000002EE, Fn2610
        jmpi_leq R16, 0x0000033E, Fn2611
        jmpi_leq R16, 0x0000037A, Fn2612
        jmpi_leq R16, 0x000003A2, Fn2613
        jmpi_leq R16, 0x000003C0, Fn2614
        jmpi_leq R16, 0x000003D4, Fn2615
        jmpi_leq R16, 0x000003E2, Fn2616
        jmpi_leq R16, 0x000003E7, Fn2617
        jmpi_equ R16, 0x000003E8, Fn2618
        jmp Fn2520
Fn2602:
        leti R15, 0x00000002
        jmp Fn2503
Fn2603:
        leti R15, 0x00000003
        jmp Fn2503
Fn2604:
        leti R15, 0x00000004
        jmp Fn2503
Fn2605:
        leti R15, 0x00000005
        jmp Fn2503
Fn2606:
        leti R15, 0x00000006
        jmp Fn2503
Fn2607:
        leti R15, 0x00000007
        jmp Fn2503
Fn2608:
        leti R15, 0x00000008
        jmp Fn2503
Fn2609:
        leti R15, 0x00000009
        jmp Fn2503
Fn2610:
        leti R15, 0x0000000A
        jmp Fn2503
Fn2611:
        leti R15, 0x0000000B
        jmp Fn2503
Fn2612:
        leti R15, 0x0000000C
        jmp Fn2503
Fn2613:
        leti R15, 0x0000000D
        jmp Fn2503
Fn2614:
        leti R15, 0x0000000E
        jmp Fn2503
Fn2615:
        leti R15, 0x0000000F
        jmp Fn2503
Fn2616:
        leti R15, 0x00000010
        jmp Fn2503
Fn2617:
        leti R15, 0x00000011
        jmp Fn2503
Fn2618:
        leti R15, 0x00000012
        jmp Fn2503
Fn2650:
        leti R5, 0x00000089
        ret 
Fn2651:
        leti R5, 0x000000BA
        ret 
Fn2652:
        leti R5, 0x00000005
        leti R6, 0x00000007
        ret 
Fn2653:
        leti R5, 0x00000002
        ret 
Fn2654:
        leti R5, 0x00000026
        ret 
Fn2655:
        leti R5, 0x0000004E
        ret 
Fn2656:
        leti R5, 0x000000B1
        ret 
Fn2657:
        leti R5, 0x00000009
        ret 
Fn2658:
        leti R5, 0x00000013
        ret 
Fn2659:
        leti R5, 0x000000AA
        ret 
Fn2660:
        leti R5, 0x000000CB
        ret 
Fn2661:
        leti R5, 0x0000000B
        muli R11, 0xFFFFFFFF
        muli R13, 0xFFFFFFFF
        muli R15, 0xFFFFFFFF
        ret 
