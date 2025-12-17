using System;
using API.DTOs;
using API.Entities;
using API.Extentions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MessagesController(IMessageRepository messageRepository,
    IMemberRepository memberRepository) : BaseApiController
{

    [HttpPost]
    public async Task<ActionResult<MessageDto>> CreateMessage (CreateMessageDto createMessageDto)
    {
        var sender = await memberRepository.GetMemberByIdAsync(User.GetMemberId());
        var Recipient = await memberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);

        if(sender == null || Recipient == null || sender.Id == createMessageDto.RecipientId)
            return BadRequest("Cannot send this message");

        var message = new Message
        {
            SenderId = sender.Id,
            RecipientId = Recipient.Id,
            Content = createMessageDto.Content
        };
        
        messageRepository.AddMessage(message);

        if(await messageRepository.SaveAllAsync()) return message.ToDto();

        return BadRequest("Failed to send message");
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<MessageDto>>> GetMessageContainer(
        [FromQuery] MessageParams messageParams)
    {
        messageParams.memberId = User.GetMemberId();

        return await messageRepository.GetMessagesForMember(messageParams);
    }

    [HttpGet("thread/{recipientId}")]
    public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetMessageThread(string recipientId)
    {
        return Ok(await messageRepository.GetMessageThread(User.GetMemberId(), recipientId));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMessage(string id)
    {
        var memberId = User.GetMemberId();

        var message = await messageRepository.GetMessage(id);

        if(message == null) return BadRequest("Cannot delete this message");

        if(message.SenderId != memberId && message.RecipientId != memberId)
            return BadRequest("You cannot delete this message");

        if(message.SenderId == memberId) message.SenderDeleted = true;
        if(message.RecipientId == memberId) message.RecipientDeleted = true;

        if(message is {SenderDeleted: true , RecipientDeleted : true})
        {
            messageRepository.DeleteMessage(message);
        }

        if(await memberRepository.SaveAllAsync()) return Ok();


        return BadRequest("Problem deleting the message");
        
    }

}
